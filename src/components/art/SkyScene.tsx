import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { colors } from '@/lib/palette';

/** Sky, sun, drifting clouds and hills, drawn behind screen headers. */
export function SkyScene({ height = 190, width = 400 }: { height?: number; width?: number }) {
  const drift = useSharedValue(0);
  useEffect(() => {
    drift.set(withRepeat(withTiming(18, { duration: 6000, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [drift]);
  const cloudStyle = useAnimatedStyle(() => ({ transform: [{ translateX: drift.value }] }));

  const h = height;
  return (
    <>
      <Svg width="100%" height={h} viewBox={`0 0 ${width} ${h}`} preserveAspectRatio="xMidYMax slice" style={StyleSheet.absoluteFill}>
        <Rect width={width} height={h} fill={colors.sky} />
        <Circle cx={width - 60} cy={46} r={42} fill={colors.sun} opacity={0.25} />
        <Circle cx={width - 60} cy={46} r={28} fill={colors.sun} />
        <Path d={`M0 ${h - 40} q${width * 0.25} -50 ${width * 0.5} -10 t${width * 0.5} -18 v${60} h-${width}z`} fill={colors.leafLight} />
        <Path d={`M0 ${h - 18} q${width * 0.3} -28 ${width * 0.6} 0 t${width * 0.4} -8 v${30} h-${width}z`} fill={colors.leaf} />
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, cloudStyle]} pointerEvents="none">
        <Svg width="100%" height={h} viewBox={`0 0 ${width} ${h}`} preserveAspectRatio="xMidYMax slice">
          <G fill={colors.white}>
            <Ellipse cx={70} cy={50} rx={32} ry={12} />
            <Ellipse cx={90} cy={41} rx={20} ry={13} />
            <Ellipse cx={220} cy={78} rx={24} ry={9} />
            <Ellipse cx={234} cy={71} rx={14} ry={9} />
          </G>
        </Svg>
      </Animated.View>
    </>
  );
}
