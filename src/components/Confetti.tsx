import { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { colors } from '@/lib/palette';

const COLORS = [colors.sun, colors.coral, colors.skyDark, colors.grape, colors.pink, colors.leaf];

type PieceProps = { x: number; delay: number; color: string; drop: number; spin: number; playKey: number };

function Piece({ x, delay, color, drop, spin, playKey }: PieceProps) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.set(0);
    t.set(withDelay(delay, withTiming(1, { duration: 1500, easing: Easing.in(Easing.quad) })));
  }, [playKey, delay, t]);
  const style = useAnimatedStyle(() => ({
    opacity: t.value === 0 ? 0 : 1 - t.value * 0.8,
    transform: [{ translateY: -30 + t.value * drop }, { rotate: `${t.value * spin}deg` }],
  }));
  return (
    <Animated.View
      style={[{ position: 'absolute', left: x, top: 0, width: 10, height: 14, borderRadius: 3, backgroundColor: color }, style]}
    />
  );
}

/** Bursts confetti over its parent each time `playKey` changes (0 = idle). */
export function Confetti({ playKey }: { playKey: number }) {
  const { width, height } = useWindowDimensions();
  const [pieces] = useState(() =>
    Array.from({ length: 34 }, (_, i) => ({
      x: Math.random() * width,
      delay: Math.random() * 350,
      color: COLORS[i % COLORS.length],
      drop: height * (0.5 + Math.random() * 0.5),
      spin: 180 + Math.random() * 540,
    })),
  );
  if (!playKey) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p, i) => (
        <Piece key={i} {...p} playKey={playKey} />
      ))}
    </View>
  );
}
