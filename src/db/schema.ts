import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'plantquest.db';

// Bump this and add a step below whenever the tables change, so app updates keep students' progress.
const DATABASE_VERSION = 3;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  if (version >= DATABASE_VERSION) return;

  if (version === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
        name TEXT,
        grade INTEGER,
        joined_at TEXT NOT NULL,
        onboarded INTEGER NOT NULL DEFAULT 0,
        auto_read INTEGER NOT NULL DEFAULT 1,
        speech_rate REAL NOT NULL DEFAULT 0.85
      );
      CREATE TABLE IF NOT EXISTS leaves_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount INTEGER NOT NULL,
        reason TEXT NOT NULL,
        ref_id TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS plant_progress (
        plant_id TEXT PRIMARY KEY NOT NULL,
        first_viewed_at TEXT NOT NULL,
        parts_tapped TEXT NOT NULL DEFAULT '[]',
        completed INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT,
        plant_id TEXT,
        started_at TEXT NOT NULL,
        finished_at TEXT NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS quiz_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        attempt_id INTEGER NOT NULL REFERENCES quiz_attempts (id),
        question_id TEXT NOT NULL,
        chosen TEXT NOT NULL,
        is_correct INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS visits (
        day TEXT PRIMARY KEY NOT NULL
      );
    `);
    version = 1;
  }

  if (version === 1) {
    // v2: chosen profile avatar (null = default look).
    await db.execAsync('ALTER TABLE profile ADD COLUMN avatar TEXT');
    version = 2;
  }

  if (version === 2) {
    // v3: sound effects and auto read-aloud on/off.
    await db.execAsync('ALTER TABLE profile ADD COLUMN sound_on INTEGER NOT NULL DEFAULT 1');
    version = 3;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
