import { Check } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Avatar, AVATARS } from '@/components/art/Avatar';
import { feedback } from '@/lib/feedback';
import { colors } from '@/lib/palette';

const GROUPS = [
  { key: 'boys', label: 'Boys' },
  { key: 'girls', label: 'Girls' },
] as const;

function Choice({ id, name, selected, size, onPress }: { id: string; name: string; selected: boolean; size: number; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={`Avatar ${name}`} onPress={onPress}>
      <View
        className="items-center rounded-3xl bg-white p-1.5"
        style={{
          borderWidth: 3,
          borderColor: selected ? colors.leaf : colors.sandDark,
          borderBottomWidth: 6,
          borderBottomColor: selected ? colors.leafDark : colors.sandDark,
        }}>
        <Avatar id={id} size={size} />
        {selected ? (
          <View className="absolute right-0 top-0 h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: colors.leaf, borderWidth: 3, borderColor: colors.white }}>
            <Check size={14} color={colors.white} strokeWidth={4} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

/**
 * Avatar choices in "Boys" and "Girls" groups.
 * `layout="grid"` for Edit profile; `layout="row"` is a compact sideways scroller for the first-run screen.
 */
export function AvatarPicker({ value, onChange, layout = 'grid' }: { value: string | null; onChange: (id: string) => void; layout?: 'grid' | 'row' }) {
  const pick = (id: string) => {
    feedback.tap();
    onChange(id);
  };

  if (layout === 'row') {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 py-1 pr-6">
        {AVATARS.map((a) => (
          <Choice key={a.id} id={a.id} name={a.name} selected={value === a.id} size={64} onPress={() => pick(a.id)} />
        ))}
      </ScrollView>
    );
  }

  return (
    <View className="gap-5">
      {GROUPS.map((g) => (
        <View key={g.key}>
          <Text className="mb-2 font-heading text-[18px] text-muted">{g.label}</Text>
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {AVATARS.filter((a) => a.group === g.key).map((a) => (
              <View key={a.id} style={{ width: '31%' }} className="items-center">
                <Choice id={a.id} name={a.name} selected={value === a.id} size={82} onPress={() => pick(a.id)} />
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
