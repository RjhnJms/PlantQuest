import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import type { BinhiStage } from '@/lib/game';
import { colors } from '@/lib/palette';

export type BinhiMood = 'happy' | 'cheer' | 'encourage';

/**
 * Binhi ("seed" in Filipino): PlantQuest's own mascot, a little potted plant that grows as the student earns leaves.
 * `hopKey` makes Binhi hop whenever it changes (e.g. after a correct answer).
 */
export function Binhi({
  stage,
  mood = 'happy',
  size = 80,
  bob = true,
  hopKey = 0,
}: {
  stage: BinhiStage;
  mood?: BinhiMood;
  size?: number;
  bob?: boolean;
  hopKey?: number;
}) {
  const y = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (!bob) return;
    y.set(withRepeat(withTiming(-4, { duration: 1200, easing: Easing.inOut(Easing.quad) }), -1, true));
  }, [bob, y]);

  useEffect(() => {
    if (!hopKey) return;
    y.set(withSequence(
      withTiming(-18, { duration: 180, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 220, easing: Easing.in(Easing.quad) }),
      withTiming(-8, { duration: 140 }),
      withTiming(0, { duration: 160 }),
      bob ? withRepeat(withTiming(-4, { duration: 1200, easing: Easing.inOut(Easing.quad) }), -1, true) : withTiming(0),
    ));
    rotate.set(withSequence(
      withTiming(-8, { duration: 150 }),
      withTiming(8, { duration: 200 }),
      withTiming(0, { duration: 200 }),
    ));
  }, [hopKey, bob, y, rotate]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={[{ width: size, height: size * 1.15 }, style]}>
      <Svg width={size} height={size * 1.15} viewBox="0 0 80 92">
        <Ellipse cx={40} cy={88} rx={26} ry={4} fill={colors.ink} opacity={0.1} />
        <Plant stage={stage} />
        {/* Pot */}
        <Path d="M20 58 h40 l-5 28 h-30z" fill={colors.coral} />
        <Path d="M22 70 h36" stroke={colors.coralDark} strokeWidth={2} opacity={0.35} />
        <Rect x={16} y={52} width={48} height={10} rx={5} fill={colors.coralLight} />
        <Face mood={mood} />
      </Svg>
    </Animated.View>
  );
}

function Plant({ stage }: { stage: BinhiStage }) {
  if (stage === 'seed') {
    return (
      <G>
        <Ellipse cx={40} cy={52} rx={9} ry={6} fill={colors.brown} />
        <Path d="M40 47 q2 -6 6 -7" stroke={colors.leaf} strokeWidth={3} strokeLinecap="round" fill="none" />
      </G>
    );
  }
  if (stage === 'sprout') {
    return (
      <G>
        <Path d="M40 53 v-14" stroke={colors.leafDark} strokeWidth={4} strokeLinecap="round" />
        <Path d="M40 42 q-12 0 -15 -11 q12 0 15 10z" fill={colors.leaf} />
        <Path d="M40 40 q11 -2 14 -12 q-11 1 -14 11z" fill={colors.leafLight} />
      </G>
    );
  }
  return (
    <G>
      <Path d="M40 53 v-24" stroke={colors.leafDark} strokeWidth={4.5} strokeLinecap="round" />
      <Path d="M40 40 q-22 -2 -26 -21 q20 0 26 20z" fill={colors.leaf} />
      <Path d="M40 34 q20 -4 24 -23 q-20 2 -24 22z" fill={colors.leafLight} />
      <Path d="M30 30 l-7 -5 M50 24 l7 -6" stroke={colors.leafDark} strokeWidth={1.5} opacity={0.5} strokeLinecap="round" />
      {stage === 'blooming' ? (
        <G>
          {[0, 72, 144, 216, 288].map((deg) => (
            <Ellipse key={deg} cx={40} cy={17} rx={5} ry={8} fill={colors.pink} transform={`rotate(${deg} 40 25)`} />
          ))}
          <Circle cx={40} cy={25} r={5.5} fill={colors.sun} />
        </G>
      ) : null}
    </G>
  );
}

function Face({ mood }: { mood: BinhiMood }) {
  return (
    <G>
      <Circle cx={32} cy={69} r={3.2} fill={colors.ink} />
      <Circle cx={48} cy={69} r={3.2} fill={colors.ink} />
      <Circle cx={33} cy={68} r={1.1} fill={colors.white} />
      <Circle cx={49} cy={68} r={1.1} fill={colors.white} />
      <Ellipse cx={26} cy={75} rx={3.5} ry={2.2} fill={colors.pink} />
      <Ellipse cx={54} cy={75} rx={3.5} ry={2.2} fill={colors.pink} />
      {mood === 'cheer' ? (
        <Path d="M34 74 q6 7 12 0z" fill={colors.ink} />
      ) : mood === 'encourage' ? (
        <Path d="M36 76 q4 -2 8 0" stroke={colors.ink} strokeWidth={2} strokeLinecap="round" fill="none" />
      ) : (
        <Path d="M35 74 q5 5 10 0" stroke={colors.ink} strokeWidth={2} strokeLinecap="round" fill="none" />
      )}
    </G>
  );
}
