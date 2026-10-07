import { useRouter } from 'expo-router';
import { Trophy } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Binhi } from '@/components/art/Binhi';
import { PlantArt } from '@/components/art/PlantArt';
import { Screen, ScreenTitle } from '@/components/Screen';
import { PLANTS } from '@/data/plants';
import { LEVELS, levelForGrade, type Level } from '@/data/questions';
import { feedback } from '@/lib/feedback';
import { plantStatus, stageFor, useGame } from '@/lib/game';
import { colors } from '@/lib/palette';

const LEVEL_STYLE: Record<Level, { bg: string; edge: string; stage: 'sprout' | 'sapling' }> = {
  sprout: { bg: colors.leaf, edge: colors.leafDark, stage: 'sprout' },
  sapling: { bg: colors.grape, edge: colors.grapeDark, stage: 'sapling' },
};

/** Quiz hub: the level quiz for the student's grade, the other level as a challenge, and plant quizzes. */
export default function QuizHub() {
  const router = useRouter();
  const { snapshot } = useGame();
  const mine = levelForGrade(snapshot.profile.grade);
  const order: Level[] = mine === 'sprout' ? ['sprout', 'sapling'] : ['sapling', 'sprout'];
  const best = snapshot.bestScore;

  return (
    <Screen>
      <ScreenTitle
        title="Quiz"
        subtitle="Answer questions, earn leaves!"
        right={
          best ? (
            <View className="items-center rounded-2xl bg-white px-3 py-1.5" style={{ borderBottomWidth: 4, borderBottomColor: colors.sandDark }}>
              <Trophy size={18} color={colors.sunDark} />
              <Text className="font-heading text-[15px] text-ink">
                {best.score}/{best.total}
              </Text>
            </View>
          ) : null
        }
      />

      <View className="gap-4 px-5">
        {order.map((level, i) => {
          const s = LEVEL_STYLE[level];
          const info = LEVELS[level];
          return (
            <Pressable
              key={level}
              accessibilityRole="button"
              accessibilityLabel={`${info.name} quiz, ${info.grades}, ${info.length} questions`}
              onPress={() => {
                feedback.tap();
                router.push({ pathname: '/play', params: { level } });
              }}>
              {({ pressed }) => (
                <View
                  className="flex-row items-center gap-3 rounded-3xl p-4"
                  style={{ backgroundColor: s.bg, borderBottomWidth: pressed ? 3 : 8, borderBottomColor: s.edge, marginTop: pressed ? 5 : 0 }}>
                  <View className="h-[84px] w-[84px] items-center justify-center rounded-2xl bg-white/25">
                    <Binhi stage={i === 0 ? stageFor(snapshot.leaves).stage : s.stage} size={64} bob={i === 0} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-[13px] text-white/90">{i === 0 ? 'YOUR LEVEL' : 'CHALLENGE'}</Text>
                    <Text className="font-heading text-[26px] text-white">{info.name} Quiz</Text>
                    <Text className="font-medium text-[15px] text-white">
                      {info.grades} · {info.length} questions
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text className="mb-3 mt-8 px-5 font-heading text-[22px] text-ink">Plant quizzes</Text>
      <View className="flex-row flex-wrap gap-3 px-5">
        {PLANTS.map((plant) => {
          const locked = plantStatus(snapshot, plant.id) === 'locked';
          return (
            <Pressable
              key={plant.id}
              accessibilityRole="button"
              accessibilityLabel={locked ? 'Locked plant quiz' : `${plant.name} quiz`}
              disabled={locked}
              onPress={() => {
                feedback.tap();
                router.push({ pathname: '/play', params: { plant: plant.id } });
              }}
              style={{ width: '30%', flexGrow: 1 }}>
              <View
                className="items-center rounded-3xl bg-white pb-2"
                style={{ borderWidth: 2.5, borderColor: locked ? colors.sandDark : plant.theme.main, borderBottomWidth: 6, opacity: locked ? 0.5 : 1 }}>
                <PlantArt plantId={plant.id} size={78} variant="compact" />
                <Text className="font-heading text-[15px] text-ink">{locked ? '???' : plant.name}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
