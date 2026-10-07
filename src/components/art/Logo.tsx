import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/lib/palette';

export function Sprout({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Path d="M30 56 v-26" stroke={colors.leafDark} strokeWidth={5} strokeLinecap="round" />
      <Path d="M30 34 q-24 0 -26 -24 q24 0 26 22z" fill={colors.leaf} />
      <Path d="M30 30 q22 -2 26 -24 q-22 2 -26 22z" fill={colors.leafLight} />
      <Path d="M28 31 q-10 -6 -16 -14 M32 28 q10 -6 15 -14" stroke={colors.leafDark} strokeWidth={1.6} opacity={0.5} strokeLinecap="round" />
    </Svg>
  );
}

export function Logo({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const big = size === 'lg';
  return (
    <View className={big ? 'items-center' : 'flex-row items-center gap-1.5'}>
      <Sprout size={big ? 72 : 30} />
      <Text className={`font-heading text-leaf-dark ${big ? 'mt-1 text-[44px]' : 'text-[22px]'}`}>PlantQuest</Text>
    </View>
  );
}
