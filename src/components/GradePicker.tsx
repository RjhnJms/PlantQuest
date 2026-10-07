import { Pressable, Text, View } from 'react-native';

import { feedback } from '@/lib/feedback';
import { colors } from '@/lib/palette';

export const GRADES = [1, 2, 3, 4, 5, 6];
export const GRADE_COLORS = [colors.coral, colors.sun, colors.leaf, colors.teal, colors.skyDark, colors.grape];
export const MAX_NAME = 20;

/** Trim, collapse spaces and capitalize: "  jamie  " -> "Jamie". */
export function cleanName(raw: string) {
  const name = raw.trim().replace(/\s+/g, ' ').slice(0, MAX_NAME);
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
}

export function GradePicker({ value, onChange }: { value: number | null; onChange: (g: number) => void }) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {GRADES.map((g, i) => {
        const on = value === g;
        return (
          <Pressable
            key={g}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`Grade ${g}`}
            onPress={() => {
              feedback.tap();
              onChange(g);
            }}
            style={{
              width: '30%',
              flexGrow: 1,
              height: 64,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: on ? GRADE_COLORS[i] : colors.white,
              borderWidth: 2.5,
              borderColor: on ? GRADE_COLORS[i] : colors.sandDark,
              borderBottomWidth: 6,
            }}>
            <Text className="font-medium text-[13px]" style={{ color: on ? colors.white : colors.muted }}>
              Grade
            </Text>
            <Text className="font-heading text-[24px] leading-[26px]" style={{ color: on ? colors.white : colors.ink }}>
              {g}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

