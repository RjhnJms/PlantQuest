import { useRouter } from 'expo-router';
import { BookOpen, Puzzle, Sprout } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Binhi } from '@/components/art/Binhi';
import { Logo } from '@/components/art/Logo';
import { ChunkyButton } from '@/components/ChunkyButton';
import { BackButton } from '@/components/Screen';
import { SpeakButton } from '@/components/SpeakButton';
import { colors } from '@/lib/palette';

function Step({ icon, bg, title, text }: { icon: ReactNode; bg: string; title: string; text: string }) {
  return (
    <View className="flex-row items-center gap-4 rounded-3xl bg-white p-4" style={{ borderBottomWidth: 5, borderBottomColor: colors.sandDark }}>
      <View className="h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: bg }}>
        {icon}
      </View>
      <View className="flex-1">
        <Text className="font-heading text-[20px] text-ink">{title}</Text>
        <Text className="font-body text-[16px] text-muted">{text}</Text>
      </View>
    </View>
  );
}

/** Screen 2: Get Started. Explains the game loop in three steps. */
export default function GetStarted() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top', 'bottom']}>
      <View className="px-5 pt-2">
        <BackButton />
      </View>
      <View className="flex-1 justify-between px-6 pb-4">
        <View>
          <View className="items-center">
            <Logo size="sm" />
            <View className="mt-2 flex-row items-center gap-3">
              <Text className="font-heading text-[26px] text-leaf-dark">Learn. Discover. Grow.</Text>
              <SpeakButton
                id="get-started"
                text="Learn. Discover. Grow. Learn about plants. Answer fun questions. Help Binhi grow!"
                size={36}
              />
            </View>
          </View>
          <View className="mt-6 gap-3">
            <Step icon={<BookOpen size={28} color={colors.white} />} bg={colors.teal} title="Learn" text="Meet amazing plants." />
            <Step icon={<Puzzle size={28} color={colors.white} />} bg={colors.grape} title="Discover" text="Answer fun questions." />
            <Step icon={<Sprout size={28} color={colors.white} />} bg={colors.leaf} title="Grow" text="Earn leaves to help Binhi grow!" />
          </View>
        </View>
        <View className="items-center">
          <Binhi stage="sprout" mood="cheer" size={84} />
          <View className="mt-3 self-stretch">
            <ChunkyButton label="GET STARTED" onPress={() => router.push('/about-you')} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
