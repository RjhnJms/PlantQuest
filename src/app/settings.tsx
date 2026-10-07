import { BookOpen, Mic, RotateCcw, Volume2 } from 'lucide-react-native';
import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Screen, ScreenTitle } from '@/components/Screen';
import { SoundToggle } from '@/components/SoundToggle';
import { VoicePicker } from '@/components/VoicePicker';
import { feedback } from '@/lib/feedback';
import { useGame } from '@/lib/game';
import { colors } from '@/lib/palette';
import { setSpeechRate, speak } from '@/lib/speech';

const SPEEDS = [
  { label: 'Slow', rate: 0.75 },
  { label: 'Normal', rate: 0.95 },
];

function Section({ icon, bg, title, children }: PropsWithChildren<{ icon: ReactNode; bg: string; title: string }>) {
  return (
    <View className="mx-5 mt-5">
      <View className="mb-2 flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: bg }}>
          {icon}
        </View>
        <Text className="font-heading text-[20px] text-ink">{title}</Text>
      </View>
      <View className="rounded-3xl bg-white px-4 py-3" style={{ borderBottomWidth: 5, borderBottomColor: colors.sandDark }}>
        {children}
      </View>
    </View>
  );
}

function Row({ title, hint, children }: PropsWithChildren<{ title: string; hint: string }>) {
  return (
    <View className="flex-row items-center justify-between py-1.5">
      <View className="flex-1 pr-3">
        <Text className="font-heading text-[18px] text-ink">{title}</Text>
        <Text className="font-body text-[14px] text-muted">{hint}</Text>
      </View>
      {children}
    </View>
  );
}

/** Settings: sound, reading, Binhi's voice and starting over. Profile stays about the student. */
export default function Settings() {
  const { snapshot, updateProfile, startOver } = useGame();
  const { profile } = snapshot;
  const [askStartOver, setAskStartOver] = useState(false);

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenTitle title="Settings" back />

      <Section icon={<Volume2 size={18} color={colors.white} />} bg={colors.skyDark} title="Sound">
        <Row title="Sounds" hint="Turn off for a quiet classroom. Speaker buttons still work.">
          <SoundToggle size={44} />
        </Row>
      </Section>

      <Section icon={<BookOpen size={18} color={colors.white} />} bg={colors.teal} title="Reading">
        <Row title="Read questions to me" hint="Binhi reads each question out loud.">
          <Switch
            value={profile.autoRead}
            onValueChange={(v) => {
              feedback.tap();
              void updateProfile({ autoRead: v });
            }}
            trackColor={{ true: colors.leaf, false: colors.sandDeep }}
            thumbColor={colors.white}
          />
        </Row>
        <Text className="mb-2 mt-3 font-heading text-[18px] text-ink">Talking speed</Text>
        <View className="mb-1 flex-row gap-3">
          {SPEEDS.map((opt) => {
            const on = Math.abs(profile.speechRate - opt.rate) < 0.05;
            return (
              <Pressable
                key={opt.label}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                onPress={() => {
                  setSpeechRate(opt.rate); // apply before the preview so it plays at the new speed
                  speak('rate-test', 'Hello! This is how I sound.');
                  void updateProfile({ speechRate: opt.rate });
                }}
                className="flex-1 items-center rounded-2xl py-3"
                style={{ backgroundColor: on ? colors.skyDark : colors.skyPale, borderBottomWidth: 4, borderBottomColor: on ? '#2F98D0' : '#BFE6F8' }}>
                <Text className="font-heading text-[17px]" style={{ color: on ? colors.white : colors.skyDark }}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section icon={<Mic size={18} color={colors.white} />} bg={colors.grape} title="Binhi's voice">
        <View className="py-1">
          <VoicePicker showTitle={false} />
        </View>
      </Section>

      <Section icon={<RotateCcw size={18} color={colors.white} />} bg={colors.coral} title="Progress">
        <Row title="Start over" hint="Clears leaves, garden and quiz scores. Your name and settings stay.">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start over"
            onPress={() => setAskStartOver(true)}
            className="rounded-2xl px-4 py-2.5"
            style={{ backgroundColor: colors.coralPale, borderBottomWidth: 4, borderBottomColor: colors.coralLight }}>
            <Text className="font-heading text-[15px] text-coral-dark">Start over</Text>
          </Pressable>
        </Row>
      </Section>

      <ConfirmDialog
        visible={askStartOver}
        title="Start over?"
        message="This clears your leaves, garden and quiz scores. Binhi goes back to a seed."
        cancelLabel="KEEP MY PROGRESS"
        confirmLabel="Start over"
        onCancel={() => setAskStartOver(false)}
        onConfirm={() => {
          setAskStartOver(false);
          void startOver();
        }}
      />
    </Screen>
  );
}
