import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';

// Read-aloud uses the phone's own text-to-speech voice. On most Android phones the English voice works offline.
// Only one thing speaks at a time; components subscribe to know whether *their* text is the one speaking.

type Listener = (id: string | null) => void;

let speakingId: string | null = null;
let rate = 0.85;
const listeners = new Set<Listener>();

function setSpeaking(id: string | null) {
  speakingId = id;
  listeners.forEach((l) => l(id));
}

export function setSpeechRate(value: number) {
  rate = value;
}

export function speak(id: string, text: string) {
  void Speech.stop();
  setSpeaking(id);
  const finish = () => {
    if (speakingId === id) setSpeaking(null);
  };
  Speech.speak(text, {
    language: 'en-US',
    rate,
    pitch: 1.1,
    onDone: finish,
    onStopped: finish,
    onError: finish,
  });
}

export function stopSpeaking() {
  void Speech.stop();
  setSpeaking(null);
}

/** Toggle: tapping the same speaker again stops it. */
export function toggleSpeak(id: string, text: string) {
  if (speakingId === id) stopSpeaking();
  else speak(id, text);
}

export function useSpeakingId() {
  const [id, setId] = useState(speakingId);
  useEffect(() => {
    listeners.add(setId);
    return () => {
      listeners.delete(setId);
    };
  }, []);
  return id;
}

/** True when at least one voice is installed. Used to show a gentle tip in Profile if read-aloud can't work. */
export async function hasVoice() {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.length > 0;
  } catch {
    return false;
  }
}
