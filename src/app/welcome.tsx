import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Binhi } from '@/components/art/Binhi';
import { Logo } from '@/components/art/Logo';
import { PlantArt } from '@/components/art/PlantArt';
import { SkyScene } from '@/components/art/SkyScene';
import { ChunkyButton } from '@/components/ChunkyButton';
import { SpeakButton } from '@/components/SpeakButton';

const LINE = 'Explore the amazing world of plants!';

/** Screen 1: Landing. */
export default function Welcome() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-cream">
      <View style={{ height: 300 }}>
        <SkyScene height={300} />
        <SafeAreaView edges={['top']} className="flex-1 items-center justify-end pb-6">
          <View className="flex-row items-end">
            <PlantArt plantId="sunflower" size={120} variant="compact" />
            <Binhi stage="sapling" mood="cheer" size={110} />
            <PlantArt plantId="cactus" size={100} variant="compact" />
          </View>
        </SafeAreaView>
      </View>

      <SafeAreaView edges={['bottom']} className="flex-1 justify-between px-6 pb-4 pt-6">
        <View className="items-center">
          <Logo />
          <View className="mt-3 flex-row items-center gap-3">
            <Text className="flex-shrink text-center font-medium text-[20px] text-ink">{LINE}</Text>
            <SpeakButton id="welcome" text={`Welcome to PlantQuest! ${LINE}`} />
          </View>
        </View>
        <ChunkyButton label="GET STARTED" onPress={() => router.push('/get-started')} />
      </SafeAreaView>
    </View>
  );
}
