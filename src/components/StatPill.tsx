import { Leaf, Sun } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { colors } from '@/lib/palette';

export function StatPill({ kind, value }: { kind: 'leaves' | 'days'; value: number }) {
  const leaves = kind === 'leaves';
  const color = leaves ? colors.leafDark : colors.coral;
  const Icon = leaves ? Leaf : Sun;
  return (
    <View
      accessibilityLabel={leaves ? `${value} leaves` : `${value} days exploring`}
      className="flex-row items-center gap-1 rounded-full bg-white px-3 py-1.5"
      style={{ borderBottomWidth: 3, borderBottomColor: colors.sandDark }}>
      <Icon size={17} color={color} strokeWidth={2.6} />
      <Text className="font-semibold text-[16px]" style={{ color }}>
        {value}
      </Text>
    </View>
  );
}
