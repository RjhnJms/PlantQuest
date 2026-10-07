import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { PLANTS, type PartKey } from '@/data/plants';
import {
  ensureProfileAndVisit,
  loadSnapshot,
  markPartTapped,
  markPlantViewed,
  resetProgress,
  saveProfile,
  saveQuizAttempt,
  type GameSnapshot,
  type Profile,
} from '@/db/queries';

export type BinhiStage = 'seed' | 'sprout' | 'sapling' | 'blooming';

export const STAGES: { key: BinhiStage; name: string; from: number }[] = [
  { key: 'seed', name: 'a seed', from: 0 },
  { key: 'sprout', name: 'a sprout', from: 10 },
  { key: 'sapling', name: 'a sapling', from: 25 },
  { key: 'blooming', name: 'blooming', from: 50 },
];

export function stageFor(leaves: number) {
  let index = 0;
  STAGES.forEach((s, i) => {
    if (leaves >= s.from) index = i;
  });
  const stage = STAGES[index];
  const next = STAGES[index + 1];
  const progress = next ? (leaves - stage.from) / (next.from - stage.from) : 1;
  return { stage: stage.key, name: stage.name, next, toNext: next ? next.from - leaves : 0, progress };
}

/** A stop on the adventure path is open once the previous plant's quiz is passed. */
export function plantStatus(snapshot: GameSnapshot, plantId: string): 'done' | 'current' | 'locked' {
  const index = PLANTS.findIndex((p) => p.id === plantId);
  if (snapshot.progress[plantId]?.completed) return 'done';
  const prev = PLANTS[index - 1];
  if (index <= 0 || snapshot.progress[prev.id]?.completed) return 'current';
  return 'locked';
}

export function displayName(profile: Profile) {
  return profile.name?.trim() || 'Explorer';
}

type GameContextValue = {
  snapshot: GameSnapshot;
  updateProfile: (fields: Parameters<typeof saveProfile>[1]) => Promise<void>;
  viewPlant: (plantId: string) => Promise<number>;
  tapPart: (plantId: string, part: PartKey, allParts: PartKey[]) => Promise<number>;
  finishQuiz: (opts: Parameters<typeof saveQuizAttempt>[1]) => Promise<number>;
  startOver: () => Promise<void>;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);

  const reload = useCallback(async () => setSnapshot(await loadSnapshot(db)), [db]);

  useEffect(() => {
    void ensureProfileAndVisit(db).then(reload);
  }, [db, reload]);

  const value = useMemo<GameContextValue | null>(() => {
    if (!snapshot) return null;
    // Every action writes to SQLite first, then re-reads, so the screen always shows what is saved.
    const withReload =
      <A extends unknown[], R>(fn: (...args: A) => Promise<R>) =>
      async (...args: A) => {
        const result = await fn(...args);
        await reload();
        return result;
      };
    return {
      snapshot,
      updateProfile: withReload((fields) => saveProfile(db, fields)),
      viewPlant: withReload((plantId) => markPlantViewed(db, plantId)),
      tapPart: withReload((plantId, part, allParts) => markPartTapped(db, plantId, part, allParts)),
      finishQuiz: withReload((opts) => saveQuizAttempt(db, opts)),
      startOver: withReload(() => resetProgress(db)),
    };
  }, [snapshot, db, reload]);

  if (!value) return null;
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
