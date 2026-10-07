import type { SQLiteDatabase } from 'expo-sqlite';

import type { PartKey } from '@/data/plants';
import type { Level } from '@/data/questions';
import type { VoiceStyle } from '@/lib/speech';

export type Profile = {
  name: string | null;
  grade: number | null;
  avatar: string | null;
  joinedAt: string;
  onboarded: boolean;
  autoRead: boolean;
  speechRate: number;
  soundOn: boolean;
  voiceId: string | null;
  voiceStyle: VoiceStyle;
};

export type PlantProgress = {
  plantId: string;
  partsTapped: PartKey[];
  completed: boolean;
};

export type GameSnapshot = {
  profile: Profile;
  leaves: number;
  progress: Record<string, PlantProgress>;
  daysVisited: number;
  quizzesTaken: number;
  bestScore: { score: number; total: number } | null;
};

export type AnswerRecord = { questionId: string; chosen: string; correct: boolean };

export const LEAVES = {
  explore: 5,
  allParts: 3,
  correct: 2,
  perfect: 5,
} as const;

const now = () => new Date().toISOString();

function today() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Creates the single profile row on first launch and logs today's visit. */
export async function ensureProfileAndVisit(db: SQLiteDatabase) {
  await db.runAsync('INSERT OR IGNORE INTO profile (id, joined_at) VALUES (1, ?)', now());
  await db.runAsync('INSERT OR IGNORE INTO visits (day) VALUES (?)', today());
}

export async function loadSnapshot(db: SQLiteDatabase): Promise<GameSnapshot> {
  const p = await db.getFirstAsync<{
    name: string | null;
    grade: number | null;
    avatar: string | null;
    joined_at: string;
    onboarded: number;
    auto_read: number;
    speech_rate: number;
    sound_on: number;
    voice_id: string | null;
    voice_style: string;
  }>('SELECT name, grade, avatar, joined_at, onboarded, auto_read, speech_rate, sound_on, voice_id, voice_style FROM profile WHERE id = 1');
  const leaves = await db.getFirstAsync<{ total: number | null }>('SELECT SUM(amount) AS total FROM leaves_log');
  const rows = await db.getAllAsync<{ plant_id: string; parts_tapped: string; completed: number }>(
    'SELECT plant_id, parts_tapped, completed FROM plant_progress',
  );
  const visits = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM visits');
  const quizzes = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM quiz_attempts');
  const best = await db.getFirstAsync<{ score: number; total: number }>(
    'SELECT score, total FROM quiz_attempts ORDER BY CAST(score AS REAL) / total DESC, total DESC LIMIT 1',
  );

  const progress: Record<string, PlantProgress> = {};
  for (const r of rows) {
    let parts: PartKey[] = [];
    try {
      parts = JSON.parse(r.parts_tapped);
    } catch {
      parts = [];
    }
    progress[r.plant_id] = { plantId: r.plant_id, partsTapped: parts, completed: r.completed === 1 };
  }

  return {
    profile: {
      name: p?.name ?? null,
      grade: p?.grade ?? null,
      avatar: p?.avatar ?? null,
      joinedAt: p?.joined_at ?? now(),
      onboarded: p?.onboarded === 1,
      autoRead: (p?.auto_read ?? 1) === 1,
      speechRate: p?.speech_rate ?? 0.85,
      soundOn: (p?.sound_on ?? 1) === 1,
      voiceId: p?.voice_id ?? null,
      voiceStyle: (p?.voice_style as VoiceStyle) ?? 'cheerful',
    },
    leaves: leaves?.total ?? 0,
    progress,
    daysVisited: visits?.n ?? 1,
    quizzesTaken: quizzes?.n ?? 0,
    bestScore: best ?? null,
  };
}

export async function saveProfile(
  db: SQLiteDatabase,
  fields: Partial<Pick<Profile, 'name' | 'grade' | 'avatar' | 'onboarded' | 'autoRead' | 'speechRate' | 'soundOn' | 'voiceId' | 'voiceStyle'>>,
) {
  const sets: string[] = [];
  const values: (string | number | null)[] = [];
  if ('name' in fields) {
    sets.push('name = ?');
    values.push(fields.name ?? null);
  }
  if ('grade' in fields) {
    sets.push('grade = ?');
    values.push(fields.grade ?? null);
  }
  if ('avatar' in fields) {
    sets.push('avatar = ?');
    values.push(fields.avatar ?? null);
  }
  if ('onboarded' in fields) {
    sets.push('onboarded = ?');
    values.push(fields.onboarded ? 1 : 0);
  }
  if ('autoRead' in fields) {
    sets.push('auto_read = ?');
    values.push(fields.autoRead ? 1 : 0);
  }
  if ('soundOn' in fields) {
    sets.push('sound_on = ?');
    values.push(fields.soundOn ? 1 : 0);
  }
  if ('voiceId' in fields) {
    sets.push('voice_id = ?');
    values.push(fields.voiceId ?? null);
  }
  if ('voiceStyle' in fields) {
    sets.push('voice_style = ?');
    values.push(fields.voiceStyle ?? 'cheerful');
  }
  if ('speechRate' in fields) {
    sets.push('speech_rate = ?');
    values.push(fields.speechRate ?? 0.85);
  }
  if (!sets.length) return;
  await db.runAsync(`UPDATE profile SET ${sets.join(', ')} WHERE id = 1`, values);
}

async function addLeaves(db: SQLiteDatabase, amount: number, reason: string, refId: string | null) {
  await db.runAsync(
    'INSERT INTO leaves_log (amount, reason, ref_id, created_at) VALUES (?, ?, ?, ?)',
    amount,
    reason,
    refId,
    now(),
  );
}

/** First visit to a plant's page plants it in the garden and earns leaves. Returns leaves earned. */
export async function markPlantViewed(db: SQLiteDatabase, plantId: string): Promise<number> {
  const result = await db.runAsync(
    'INSERT OR IGNORE INTO plant_progress (plant_id, first_viewed_at) VALUES (?, ?)',
    plantId,
    now(),
  );
  if (result.changes === 0) return 0;
  await addLeaves(db, LEAVES.explore, 'explore', plantId);
  return LEAVES.explore;
}

/** Records a tapped part. Returns leaves earned (only when the last new part is found). */
export async function markPartTapped(
  db: SQLiteDatabase,
  plantId: string,
  part: PartKey,
  allParts: PartKey[],
): Promise<number> {
  const row = await db.getFirstAsync<{ parts_tapped: string }>(
    'SELECT parts_tapped FROM plant_progress WHERE plant_id = ?',
    plantId,
  );
  if (!row) return 0;
  const tapped = new Set<PartKey>(JSON.parse(row.parts_tapped));
  if (tapped.has(part)) return 0;
  tapped.add(part);
  await db.runAsync('UPDATE plant_progress SET parts_tapped = ? WHERE plant_id = ?', JSON.stringify([...tapped]), plantId);
  if (allParts.every((p) => tapped.has(p))) {
    await addLeaves(db, LEAVES.allParts, 'all-parts', plantId);
    return LEAVES.allParts;
  }
  return 0;
}

/** Saves a finished quiz and its leaves in one transaction. Returns leaves earned. */
export async function saveQuizAttempt(
  db: SQLiteDatabase,
  opts: { level: Level | null; plantId: string | null; startedAt: string; answers: AnswerRecord[]; passed: boolean },
): Promise<number> {
  const score = opts.answers.filter((a) => a.correct).length;
  const total = opts.answers.length;
  const earned = score * LEAVES.correct + (score === total && total > 0 ? LEAVES.perfect : 0);

  await db.withTransactionAsync(async () => {
    const res = await db.runAsync(
      'INSERT INTO quiz_attempts (level, plant_id, started_at, finished_at, score, total) VALUES (?, ?, ?, ?, ?, ?)',
      opts.level,
      opts.plantId,
      opts.startedAt,
      now(),
      score,
      total,
    );
    for (const a of opts.answers) {
      await db.runAsync(
        'INSERT INTO quiz_answers (attempt_id, question_id, chosen, is_correct) VALUES (?, ?, ?, ?)',
        res.lastInsertRowId,
        a.questionId,
        a.chosen,
        a.correct ? 1 : 0,
      );
    }
    if (earned > 0) await addLeaves(db, earned, 'quiz', String(res.lastInsertRowId));
    if (opts.plantId && opts.passed) {
      await db.runAsync(
        'INSERT INTO plant_progress (plant_id, first_viewed_at, completed) VALUES (?, ?, 1) ON CONFLICT(plant_id) DO UPDATE SET completed = 1',
        opts.plantId,
        now(),
      );
    }
  });
  return earned;
}

/** Wipes progress but keeps the app installed state (used by "Start over" in Profile). */
export async function resetProgress(db: SQLiteDatabase) {
  await db.execAsync(`
    DELETE FROM quiz_answers;
    DELETE FROM quiz_attempts;
    DELETE FROM leaves_log;
    DELETE FROM plant_progress;
  `);
}
