import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, ScrollView, Text, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/lib/palette';

export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  ...rest
}: PropsWithChildren<{ scroll?: boolean; edges?: ('top' | 'bottom')[] } & ScrollViewProps>) {
  return (
    <SafeAreaView className="flex-1 bg-cream" edges={edges}>
      {scroll ? (
        <ScrollView className="flex-1" contentContainerClassName="pb-10" showsVerticalScrollIndicator={false} {...rest}>
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}

export function BackButton({ onPress }: { onPress?: () => void }) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={10}
      onPress={onPress ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
      className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
      style={{ borderBottomWidth: 3, borderBottomColor: colors.sandDark }}>
      <ChevronLeft size={26} color={colors.ink} strokeWidth={2.8} />
    </Pressable>
  );
}

export function ScreenTitle({ title, subtitle, right, back }: { title: string; subtitle?: string; right?: ReactNode; back?: boolean }) {
  return (
    <View className="flex-row items-center gap-3 px-5 pb-3 pt-3">
      {back ? <BackButton /> : null}
      <View className="flex-1">
        <Text className="font-heading text-[30px] text-ink">{title}</Text>
        {subtitle ? <Text className="font-medium text-[15px] text-muted">{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}
