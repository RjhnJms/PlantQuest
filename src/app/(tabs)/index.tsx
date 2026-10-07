import { useRouter } from 'expo-router';
import { Check, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Avatar } from '@/components/art/Avatar';
import { Binhi } from '@/components/art/Binhi';
import { PlantArt } from '@/components/art/PlantArt';
import { SkyScene } from '@/components/art/SkyScene';
import { ProgressBar } from '@/components/ProgressBar';
import { SpeakButton } from '@/components/SpeakButton';
import { StatPill } from '@/components/StatPill';
import { PLANTS, type Plant } from '@/data/plants';
import { feedback } from '@/lib/feedback';
import { displayName, plantStatus, stageFor, useGame } from '@/lib/game';
import { colors } from '@/lib/palette';
import { speak } from '@/lib/speech';

const TICKLES = ['Hee hee, that tickles!', 'Let us learn something new!', 'I love sunshine!', 'More leaves, please!', 'You are doing great!'];

const STOP = 84;
const ROW = 124;

/** Home: greeting, Binhi's growth card and the adventure path of plants. */
export default function Home() {
  const router = useRouter();
  const { snapshot } = useGame();
  const { width } = useWindowDimensions();
  const name = displayName(snapshot.profile);
  const growth = stageFor(snapshot.leaves);
  const [hop, setHop] = useState(0);
  const [talk, setTalk] = useState<string | null>(null);

  const status = PLANTS.map((p) => plantStatus(snapshot, p.id));
  const done = status.filter((s) => s === 'done').length;
  const binhiLine =
    talk ??
    (growth.next ? `${growth.toNext} more leaves to grow!` : 'I am blooming! Thank you!');

  // Stops zig-zag across the screen like a game map.
  const pathWidth = Math.min(width, 480) - 40;
  const xs = [0.5, 0.78, 0.5, 0.22, 0.5, 0.78].map((f) => f * pathWidth);
  const pathD = xs
    .map((x, i) => {
      const y = i * ROW + STOP / 2;
      if (i === 0) return `M${x} ${y}`;
      const py = (i - 1) * ROW + STOP / 2;
      return `C${xs[i - 1]} ${py + ROW / 2} ${x} ${y - ROW / 2} ${x} ${y}`;
    })
    .join(' ');

  return (
    <View className="flex-1 bg-cream">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
        <View style={{ height: 210 }}>
          <SkyScene height={210} />
          <SafeAreaView edges={['top']}>
            <View className="flex-row items-center justify-between px-5 pt-2">
              <View className="flex-row items-center gap-2 rounded-full bg-white py-1 pl-1 pr-4" style={{ borderBottomWidth: 3, borderBottomColor: colors.sandDark }}>
                <Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={() => router.navigate('/profile')}>
                  <Avatar id={snapshot.profile.avatar} size={38} />
                </Pressable>
                <Text className="font-heading text-[18px] text-ink" numberOfLines={1}>
                  Hi, {name}!
                </Text>
              </View>
              <View className="flex-row gap-2">
                <StatPill kind="days" value={snapshot.daysVisited} />
                <StatPill kind="leaves" value={snapshot.leaves} />
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* Binhi card overlaps the hills */}
        <View className="-mt-16 px-5">
          <View className="flex-row items-center gap-3 rounded-3xl bg-white p-4" style={{ borderBottomWidth: 6, borderBottomColor: colors.sandDark }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tap Binhi"
              onPress={() => {
                const line = TICKLES[Math.floor(Math.random() * TICKLES.length)];
                setTalk(line);
                setHop((h) => h + 1);
                feedback.tap();
                speak('binhi-home', line);
              }}>
              <Binhi stage={growth.stage} mood={talk ? 'cheer' : 'happy'} size={78} hopKey={hop} />
            </Pressable>
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="flex-1 font-heading text-[18px] text-ink">{binhiLine}</Text>
                <SpeakButton id="binhi-line" text={`Binhi is ${growth.name}. ${binhiLine}`} size={34} />
              </View>
              <Text className="mb-2 mt-0.5 font-medium text-[14px] text-muted">Binhi is {growth.name}</Text>
              <ProgressBar value={growth.progress} />
            </View>
          </View>
        </View>

        <View className="mt-7 flex-row items-baseline justify-between px-5">
          <Text className="font-heading text-[24px] text-ink">Plant Adventure</Text>
          <Text className="font-semibold text-[15px] text-muted">
            {done} of {PLANTS.length} done
          </Text>
        </View>

        <View className="mt-12 self-center" style={{ width: pathWidth, height: (PLANTS.length - 1) * ROW + STOP + 40 }}>
          <Svg width={pathWidth} height={(PLANTS.length - 1) * ROW + STOP} style={{ position: 'absolute' }}>
            <Path d={pathD} stroke={colors.sandDark} strokeWidth={14} strokeLinecap="round" strokeDasharray="1 24" fill="none" />
          </Svg>
          {PLANTS.map((plant, i) => (
            <PathStop
              key={plant.id}
              plant={plant}
              status={status[i]}
              left={xs[i] - STOP / 2}
              top={i * ROW}
              onOpen={() => router.push({ pathname: '/plant/[id]', params: { id: plant.id } })}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function PathStop({
  plant,
  status,
  left,
  top,
  onOpen,
}: {
  plant: Plant;
  status: 'done' | 'current' | 'locked';
  left: number;
  top: number;
  onOpen: () => void;
}) {
  const shake = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));
  const locked = status === 'locked';
  const current = status === 'current';
  const bg = locked ? colors.sand : plant.theme.main;
  const edge = locked ? colors.sandDeep : plant.theme.dark;

  return (
    <View style={{ position: 'absolute', left, top, width: STOP, alignItems: 'center' }}>
      {current ? (
        <View className="absolute z-10 rounded-xl px-2.5 py-1" style={{ top: -30, backgroundColor: colors.ink }}>
          <Text className="font-semibold text-[12px] text-white">START</Text>
        </View>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={locked ? `${plant.name}, locked` : plant.name}
        accessibilityHint={locked ? 'Finish the plant before it to unlock' : 'Open this plant'}
        onPress={() => {
          if (locked) {
            feedback.tryAgain();
            shake.set(withSequence(withTiming(-8, { duration: 60 }), withTiming(8, { duration: 80 }), withTiming(-5, { duration: 70 }), withTiming(0, { duration: 60 })));
            speak('locked', `Finish the plant before ${plant.name} to unlock it!`);
            return;
          }
          feedback.tap();
          onOpen();
        }}>
        {({ pressed }) => (
          <Animated.View
            style={[
              {
                width: STOP,
                height: STOP,
                borderRadius: STOP / 2,
                backgroundColor: bg,
                borderBottomWidth: pressed ? 3 : 8,
                borderBottomColor: edge,
                marginTop: pressed ? 5 : 0,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderWidth: current ? 5 : 0,
                borderColor: current ? colors.white : 'transparent',
              },
              style,
            ]}>
            {locked ? (
              <Lock size={30} color={colors.faint} strokeWidth={2.6} />
            ) : (
              <View style={{ marginTop: 6 }}>
                <PlantArt plantId={plant.id} size={62} variant="compact" />
              </View>
            )}
          </Animated.View>
        )}
      </Pressable>
      {status === 'done' ? (
        <View className="absolute right-0 h-7 w-7 items-center justify-center rounded-full" style={{ top: -2, backgroundColor: colors.leaf, borderWidth: 3, borderColor: colors.white }}>
          <Check size={14} color={colors.white} strokeWidth={4} />
        </View>
      ) : null}
      <Text className="mt-1 font-heading text-[15px]" style={{ color: locked ? colors.faint : colors.ink }}>
        {plant.name}
      </Text>
    </View>
  );
}
