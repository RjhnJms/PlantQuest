import { useRouter } from 'expo-router';
import { ChevronRight, Lock } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { PlantArt } from '@/components/art/PlantArt';
import { Screen, ScreenTitle } from '@/components/Screen';
import { PLANTS } from '@/data/plants';
import { feedback } from '@/lib/feedback';
import { plantStatus, useGame } from '@/lib/game';
import { colors } from '@/lib/palette';
import { speak } from '@/lib/speech';

/** Plants: every plant as a colorful card. Locked plants show as mystery cards. */
export default function Plants() {
  const router = useRouter();
  const { snapshot } = useGame();
  const explored = PLANTS.filter((p) => snapshot.progress[p.id]).length;

  return (
    <Screen>
      <ScreenTitle title="Plants" subtitle={`${explored} of ${PLANTS.length} explored`} />
      <View className="gap-4 px-5">
        {PLANTS.map((plant, i) => {
          const locked = plantStatus(snapshot, plant.id) === 'locked';
          const done = snapshot.progress[plant.id]?.completed;
          return (
            <Pressable
              key={plant.id}
              accessibilityRole="button"
              accessibilityLabel={locked ? `Mystery plant, locked` : `${plant.name}. ${plant.short}`}
              onPress={() => {
                if (locked) {
                  feedback.tryAgain();
                  speak('locked', `Keep exploring to unlock this plant!`);
                  return;
                }
                feedback.tap();
                router.push({ pathname: '/plant/[id]', params: { id: plant.id } });
              }}>
              {({ pressed }) => (
                <View
                  className="flex-row items-center gap-4 rounded-3xl bg-white p-3"
                  style={{
                    borderWidth: 2.5,
                    borderColor: locked ? colors.sandDark : plant.theme.main,
                    borderBottomWidth: pressed ? 3 : 7,
                    marginTop: pressed ? 4 : 0,
                  }}>
                  <View
                    className="h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-2xl"
                    style={{ backgroundColor: locked ? colors.sand : plant.theme.pale }}>
                    {locked ? <Lock size={30} color={colors.faint} /> : <PlantArt plantId={plant.id} size={82} variant="compact" />}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="font-heading text-[22px]" style={{ color: locked ? colors.faint : colors.ink }}>
                        {locked ? '???' : plant.name}
                      </Text>
                      {done ? (
                        <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: colors.leafPale }}>
                          <Text className="font-semibold text-[12px] text-leaf-dark">Done</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text className="font-body text-[16px] text-muted">
                      {locked ? `Finish stop ${i} to unlock` : plant.short}
                    </Text>
                  </View>
                  {!locked ? <ChevronRight size={26} color={plant.theme.dark} strokeWidth={3} /> : null}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
