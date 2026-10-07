import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { colors } from '@/lib/palette';

/** Thick rounded bar with a shine stripe; animates when the value grows. */
export function ProgressBar({ value, color = colors.leaf, height = 14 }: { value: number; color?: string; height?: number }) {
  const width = useSharedValue(0);
  useEffect(() => {
    width.set(withSpring(Math.max(0, Math.min(1, value)), { damping: 16 }));
  }, [value, width]);
  const style = useAnimatedStyle(() => ({ width: `${width.value * 100}%` }));

  return (
    <View style={{ height, borderRadius: height, backgroundColor: colors.sand, overflow: 'hidden' }}>
      <Animated.View style={[{ height: '100%', borderRadius: height, backgroundColor: color }, style]}>
        <View
          style={{
            position: 'absolute',
            top: 3,
            left: 6,
            right: 6,
            height: Math.max(3, height / 4),
            borderRadius: 4,
            backgroundColor: colors.white,
            opacity: 0.35,
          }}
        />
      </Animated.View>
    </View>
  );
}
