import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Read-aloud uses the phone's own text-to-speech voice. On most Android phones the English voice works offline.
// Only one thing speaks at a time; components subscribe to know whether *their* text is the one speaking.

type Listener = (id: string | null) => void;

export type VoiceStyle = 'cheerful' | 'normal' | 'calm';

/** Same voice, different feel: works even on phones with only one voice installed. */
export const VOICE_STYLES: { key: VoiceStyle; label: string; pitch: number }[] = [
  { key: 'cheerful', label: 'Cheerful', pitch: 1.2 },
  { key: 'normal', label: 'Normal', pitch: 1.0 },
  { key: 'calm', label: 'Calm', pitch: 0.88 },
];

export type BinhiVoice = {
  id: string;
  /** Kid-friendly label, e.g. "Voice 2 · American". Phones don't say whether a voice is male or female. */
  label: string;
  language: string;
};

let speakingId: string | null = null;
let rate = 0.85;
let pitch = VOICE_STYLES[0].pitch;
let chosenVoice: string | null = null;
let bestVoice: string | null = null;
let autoSpeech = true;
const listeners = new Set<Listener>();

function setSpeaking(id: string | null) {
  speakingId = id;
  listeners.forEach((l) => l(id));
}

export function setSpeechRate(value: number) {
  rate = value;
}

export function setVoiceStyle(style: VoiceStyle) {
  pitch = (VOICE_STYLES.find((s) => s.key === style) ?? VOICE_STYLES[0]).pitch;
}

/** null = automatic (best offline voice on this phone). */
export function setVoice(id: string | null) {
  chosenVoice = id;
}

/** Off when the student turns Sound off: the app stops talking on its own, but speaker buttons still work. */
export function setAutoSpeech(on: boolean) {
  autoSpeech = on;
  if (!on) stopSpeaking();
}

/** Speech the app starts by itself (Binhi's lines, auto-read, quiz feedback). Silent when Sound is off. */
export function autoSpeak(id: string, text: string) {
  if (autoSpeech) speak(id, text);
}

export function speak(id: string, text: string, override?: { voice?: string | null; style?: VoiceStyle }) {
  void Speech.stop();
  setSpeaking(id);
  const finish = () => {
    if (speakingId === id) setSpeaking(null);
  };
  const voice = (override && 'voice' in override ? override.voice : chosenVoice) ?? bestVoice ?? undefined;
  const stylePitch = override?.style ? VOICE_STYLES.find((s) => s.key === override.style)?.pitch : undefined;
  Speech.speak(text, {
    language: 'en-US',
    voice,
    rate,
    pitch: stylePitch ?? pitch,
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

const ACCENTS: Record<string, string> = {
  US: 'American',
  GB: 'British',
  AU: 'Australian',
  IN: 'Indian',
  PH: 'Filipino',
  CA: 'Canadian',
  IE: 'Irish',
  NZ: 'New Zealand',
  ZA: 'South African',
  NG: 'Nigerian',
  SG: 'Singaporean',
};

// Order for picking the automatic voice: clear, common accents first.
const PREFERRED = ['US', 'PH', 'GB', 'AU', 'CA'];

function region(language: string) {
  return (language.replace('_', '-').split('-')[1] ?? '').toUpperCase();
}

/** Voices that need the internet (they'd fail offline). Android marks them "network"; browsers "Online"/"Google". */
function needsInternet(v: Speech.Voice) {
  const text = `${v.identifier} ${v.name}`.toLowerCase();
  if (text.includes('network') || text.includes('online') || text.includes('natural')) return true;
  return Platform.OS === 'web' && v.name.startsWith('Google');
}

let voicesRequest: Promise<Speech.Voice[]> | null = null;

/**
 * All installed voices, looked up once and shared. On web, Expo's lookup waits for a "voices changed" event that
 * only answers the most recent caller, so read the browser's list directly, retrying briefly while it loads.
 */
function installedVoices(): Promise<Speech.Voice[]> {
  voicesRequest ??= (async () => {
    for (let attempt = 0; attempt < 12; attempt++) {
      let found: Speech.Voice[] = [];
      try {
        if (Platform.OS === 'web') {
          found = (globalThis.speechSynthesis?.getVoices() ?? []).map((v) => ({
            identifier: v.voiceURI,
            name: v.name,
            language: v.lang,
            quality: Speech.VoiceQuality.Default,
          }));
        } else {
          found = await Speech.getAvailableVoicesAsync();
        }
      } catch {
        found = [];
      }
      if (found.length) return found;
      await new Promise((r) => setTimeout(r, 250));
    }
    voicesRequest = null; // nothing yet; let a later call try again
    return [];
  })();
  return voicesRequest;
}

/**
 * Offline English voices on this phone, best first, as kid-friendly choices.
 * Also remembers the best one so read-aloud uses it when the student hasn't picked.
 */
export async function listBinhiVoices(): Promise<BinhiVoice[]> {
  const voices = await installedVoices();
  const english = voices.filter((v) => v.language.toLowerCase().startsWith('en') && !needsInternet(v));
  const rank = (v: Speech.Voice) => {
    const r = PREFERRED.indexOf(region(v.language));
    return (v.quality === Speech.VoiceQuality.Enhanced ? 0 : 100) + (r === -1 ? 50 : r);
  };
  const unique = [...new Map(english.map((v) => [v.identifier, v])).values()];
  const sorted = unique.sort((a, b) => rank(a) - rank(b)).slice(0, 8);

  bestVoice = sorted[0]?.identifier ?? null;
  return sorted.map((v, i) => {
    const accent = ACCENTS[region(v.language)];
    return { id: v.identifier, language: v.language, label: accent ? `Voice ${i + 1} · ${accent}` : `Voice ${i + 1}` };
  });
}
