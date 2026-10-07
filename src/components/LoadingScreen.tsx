import Constants from 'expo-constants';
import { WifiOff } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Binhi } from '@/components/art/Binhi';
import { Logo } from '@/components/art/Logo';
import { SkyScene } from '@/components/art/SkyScene';
import type { BinhiStage } from '@/lib/game';
import { DEVELOPERS } from '@/lib/credits';
import { colors } from '@/lib/palette';

/** How long the bar takes to fill, even when the app loads faster. */
const FILL_MS = 3200;
/** Short pause on a full bar so kids see it finish before the app opens. */
const HOLD_MS = 350;
const SKY_HEIGHT = 320;

const STEPS: { until: number; message: string; stage: BinhiStage }[] = [
  { until: 0.25, message: 'Planting seeds…', stage: 'seed' },
  { until: 0.5, message: 'Watering the garden…', stage: 'sprout' },
  { until: 0.8, message: 'Waking up Binhi…', stage: 'sapling' },
  { until: 1, message: 'Almost ready!', stage: 'blooming' },
];

/**
 * Loading screen shown every time the app opens: logo, name, a progress bar that must fill before the app
 * appears, and the developers' names. The bar only reaches 100% once the app has really loaded (`ready`).
 */
export function LoadingScreen({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const started = useRef<number | null>(null);
  const readyRef = useRef(ready);
  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  useEffect(() => {
    started.current = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - (started.current ?? Date.now());
      // Holds at 95% until the database and profile are loaded, so 100% always means "ready".
      const cap = readyRef.current ? 1 : 0.95;
      const next = Math.min(cap, elapsed / FILL_MS);
      setProgress(next);
      if (next >= 1) {
        clearInterval(timer);
        setTimeout(onDone, HOLD_MS);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [onDone]);

  const step = STEPS.find((s) => progress <= s.until) ?? STEPS[STEPS.length - 1];
  const percent = Math.round(progress * 100);
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Animated.View exiting={FadeOut.duration(350)} style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
      <View style={{ height: SKY_HEIGHT }}>
        <SkyScene height={SKY_HEIGHT} />
        <View className="flex-1 items-center justify-end pb-6">
          <Binhi stage={step.stage} mood={progress >= 1 ? 'cheer' : 'happy'} size={120} />
        </View>
      </View>

      <SafeAreaView edges={['bottom']} className="flex-1">
        <View className="flex-1 justify-between px-8 pt-7">
          <View className="items-center">
            <Logo />
            <Text className="mt-1 font-semibold text-[18px] text-muted">Learn. Discover. Grow.</Text>

            <View
              accessibilityRole="progressbar"
              accessibilityLabel="Loading PlantQuest"
              accessibilityValue={{ min: 0, max: 100, now: percent }}
              className="mt-8 w-full overflow-hidden rounded-full"
              style={{
                height: 22,
                backgroundColor: colors.sand,
                borderWidth: 3,
                borderColor: colors.white,
              }}>
              <View className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: colors.leaf }}>
                <View className="absolute left-2 right-2 top-1 rounded-full bg-white/40" style={{ height: 4 }} />
              </View>
            </View>
            <View className="mt-2 w-full flex-row justify-between">
              <Text className="font-semibold text-[15px] text-leaf-dark">{step.message}</Text>
              <Text className="font-heading text-[15px] text-ink">{percent}%</Text>
            </View>
          </View>

          <View className="items-center pb-4">
            <Text className="font-semibold text-[13px] tracking-widest text-faint">DEVELOPED BY</Text>
            {DEVELOPERS.map((name) => (
              <Text key={name} className="mt-0.5 text-center font-heading text-[17px] text-ink">
                {name}
              </Text>
            ))}
            <View className="mt-3 flex-row items-center gap-1.5">
              <WifiOff size={13} color={colors.faint} />
              <Text className="font-medium text-[13px] text-faint">Works offline · Version {version}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
