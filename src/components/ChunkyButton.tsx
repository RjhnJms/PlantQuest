import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { feedback } from '@/lib/feedback';
import { colors } from '@/lib/palette';

const VARIANTS = {
  leaf: { bg: colors.leaf, edge: colors.leafDark, text: colors.white },
  sun: { bg: colors.sun, edge: colors.sunDark, text: colors.ink },
  grape: { bg: colors.grape, edge: colors.grapeDark, text: colors.white },
  coral: { bg: colors.coral, edge: colors.coralDark, text: colors.white },
  sky: { bg: colors.skyDark, edge: '#2F98D0', text: colors.white },
  white: { bg: colors.white, edge: colors.sandDark, text: colors.ink },
  off: { bg: colors.sand, edge: colors.sandDeep, text: colors.faint },
} as const;

export type ChunkyVariant = keyof typeof VARIANTS;

/** Game-style 3D button: a thick darker bottom edge that squashes when pressed. */
export function ChunkyButton({
  label,
  onPress,
  variant = 'leaf',
  icon,
  size = 'lg',
  disabled = false,
  accessibilityHint,
}: {
  label: string;
  onPress?: () => void;
  variant?: ChunkyVariant;
  icon?: ReactNode;
  size?: 'lg' | 'md' | 'sm';
  disabled?: boolean;
  accessibilityHint?: string;
}) {
  const v = VARIANTS[disabled ? 'off' : variant];
  const pad = size === 'lg' ? 16 : size === 'md' ? 12 : 8;
  const edge = size === 'sm' ? 4 : 6;
  const fontSize = size === 'lg' ? 20 : size === 'md' ? 17 : 15;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      onPress={() => {
        feedback.tap();
        onPress?.();
      }}>
      {({ pressed }) => (
        <View
          style={{
            backgroundColor: v.bg,
            borderRadius: size === 'sm' ? 14 : 20,
            borderWidth: variant === 'white' && !disabled ? 2.5 : 0,
            borderColor: v.edge,
            borderBottomWidth: pressed ? 2 : edge,
            borderBottomColor: v.edge,
            marginTop: pressed ? edge - 2 : 0,
            paddingVertical: pad,
            paddingHorizontal: pad + 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            minHeight: size === 'sm' ? 40 : 56,
          }}>
          {icon}
          <Text style={{ color: v.text, fontSize, letterSpacing: 0.5 }} className="font-heading">
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
