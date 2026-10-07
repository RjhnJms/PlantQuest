import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Sound effects are bundled WAV files generated for this app, so they play with no internet.
const SOURCES = {
  tap: require('../../assets/sounds/tap.wav'),
  correct: require('../../assets/sounds/correct.wav'),
  try: require('../../assets/sounds/try.wav'),
  reward: require('../../assets/sounds/reward.wav'),
  levelup: require('../../assets/sounds/levelup.wav'),
} as const;

export type SoundName = keyof typeof SOURCES;

const players: Partial<Record<SoundName, AudioPlayer>> = {};

function player(name: SoundName) {
  if (!players[name]) players[name] = createAudioPlayer(SOURCES[name]);
  return players[name]!;
}

export function playSound(name: SoundName) {
  try {
    const p = player(name);
    void p.seekTo(0);
    p.play();
  } catch {
    // A missing sound should never break a lesson.
  }
}

export function haptic(kind: 'tap' | 'success' | 'gentle') {
  if (Platform.OS === 'web') return;
  if (kind === 'tap') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  else if (kind === 'success') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/** Sound + vibration together, for the common moments. */
export const feedback = {
  tap: () => (playSound('tap'), haptic('tap')),
  correct: () => (playSound('correct'), haptic('success')),
  tryAgain: () => (playSound('try'), haptic('gentle')),
  reward: () => (playSound('reward'), haptic('success')),
  levelUp: () => (playSound('levelup'), haptic('success')),
};
