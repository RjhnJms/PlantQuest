import { Check, Play, Sparkles, Square } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { feedback } from '@/lib/feedback';
import { useGame } from '@/lib/game';
import { colors } from '@/lib/palette';
import {
  listBinhiVoices,
  setVoice,
  setVoiceStyle,
  speak,
  stopSpeaking,
  useSpeakingId,
  VOICE_STYLES,
  type BinhiVoice,
  type VoiceStyle,
} from '@/lib/speech';

const SAMPLE = "Hi! I'm Binhi. Let's learn about plants!";
const AUTO = 'auto';

function Option({
  label,
  hint,
  selected,
  playing,
  icon,
  onSelect,
  onPreview,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  playing: boolean;
  icon?: React.ReactNode;
  onSelect: () => void;
  onPreview: () => void;
}) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={label} onPress={onSelect}>
      <View
        className="flex-row items-center gap-3 rounded-2xl px-3 py-2.5"
        style={{
          backgroundColor: selected ? colors.leafPale : colors.white,
          borderWidth: 2.5,
          borderColor: selected ? colors.leaf : colors.sandDark,
          borderBottomWidth: 5,
        }}>
        <View
          className="h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: selected ? colors.leaf : colors.sand }}>
          {selected ? <Check size={16} color={colors.white} strokeWidth={3.5} /> : icon}
        </View>
        <View className="flex-1">
          <Text className="font-heading text-[17px] text-ink">{label}</Text>
          {hint ? <Text className="font-body text-[13px] text-muted">{hint}</Text> : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={playing ? `Stop ${label}` : `Listen to ${label}`}
          hitSlop={8}
          onPress={onPreview}
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: playing ? colors.skyDark : colors.skyPale }}>
          {playing ? (
            <Square size={14} color={colors.white} fill={colors.white} />
          ) : (
            <Play size={16} color={colors.skyDark} fill={colors.skyDark} />
          )}
        </Pressable>
      </View>
    </Pressable>
  );
}

/**
 * "Binhi's voice": the student picks from the offline English voices on their phone (with a preview),
 * plus a style that changes the pitch. Phones don't label voices male or female, so the student simply listens and chooses.
 */
export function VoicePicker({ showTitle = true }: { showTitle?: boolean }) {
  const { snapshot, updateProfile } = useGame();
  const { voiceId, voiceStyle } = snapshot.profile;
  const [voices, setVoices] = useState<BinhiVoice[] | null>(null);
  const speakingId = useSpeakingId();

  useEffect(() => {
    let active = true;
    void listBinhiVoices().then((v) => active && setVoices(v));
    return () => {
      active = false;
      stopSpeaking();
    };
  }, []);

  // A saved voice this phone no longer has counts as automatic.
  const current = voiceId && voices?.some((v) => v.id === voiceId) ? voiceId : AUTO;

  const preview = (key: string, voice: string | null, style: VoiceStyle = voiceStyle) => {
    if (speakingId === `voice-${key}`) stopSpeaking();
    else speak(`voice-${key}`, SAMPLE, { voice, style });
  };

  const chooseVoice = (key: string, voice: string | null) => {
    feedback.tap();
    setVoice(voice); // apply now; the save follows
    void updateProfile({ voiceId: voice });
    speak(`voice-${key}`, SAMPLE, { voice });
  };

  const chooseStyle = (style: VoiceStyle) => {
    feedback.tap();
    setVoiceStyle(style);
    void updateProfile({ voiceStyle: style });
    speak('voice-style', SAMPLE, { style });
  };

  return (
    <View>
      {showTitle ? <Text className="font-heading text-[18px] text-ink">Binhi&apos;s voice</Text> : null}
      <Text className="mb-3 font-body text-[14px] text-muted">Tap ▶ to listen, then pick the one you like.</Text>

      {voices === null ? (
        <Text className="py-3 font-medium text-[15px] text-muted">Looking for voices…</Text>
      ) : voices.length === 0 ? (
        <Text className="py-2 font-medium text-[14px] text-coral-dark">
          No offline voices found. Ask a grown-up to download an English voice in Settings, then Text-to-speech.
        </Text>
      ) : (
        <View className="gap-2.5">
          <Option
            label="Automatic"
            hint="The clearest voice on this phone"
            selected={current === AUTO}
            playing={speakingId === `voice-${AUTO}`}
            icon={<Sparkles size={15} color={colors.muted} />}
            onSelect={() => chooseVoice(AUTO, null)}
            onPreview={() => preview(AUTO, null)}
          />
          {voices.map((v) => (
            <Option
              key={v.id}
              label={v.label}
              selected={current === v.id}
              playing={speakingId === `voice-${v.id}`}
              onSelect={() => chooseVoice(v.id, v.id)}
              onPreview={() => preview(v.id, v.id)}
            />
          ))}
        </View>
      )}

      <Text className="mb-2 mt-4 font-heading text-[18px] text-ink">Voice style</Text>
      <View className="flex-row gap-2">
        {VOICE_STYLES.map((s) => {
          const on = voiceStyle === s.key;
          return (
            <Pressable
              key={s.key}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => chooseStyle(s.key)}
              className="flex-1 items-center rounded-2xl py-3"
              style={{ backgroundColor: on ? colors.grape : colors.grapePale, borderBottomWidth: 4, borderBottomColor: on ? colors.grapeDark : '#DCCBFF' }}>
              <Text className="font-heading text-[16px]" style={{ color: on ? colors.white : colors.grapeDark }}>
                {s.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
