import { useLocalSearchParams, useRouter } from 'expo-router';
import { Lightbulb, Leaf } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PlantArt } from '@/components/art/PlantArt';
import { ChunkyButton } from '@/components/ChunkyButton';
import { Confetti } from '@/components/Confetti';
import { BackButton } from '@/components/Screen';
import { SpeakButton } from '@/components/SpeakButton';
import { getPlant, type PartKey } from '@/data/plants';
import { feedback } from '@/lib/feedback';
import { useGame } from '@/lib/game';
import { colors } from '@/lib/palette';
import { autoSpeak, stopSpeaking } from '@/lib/speech';

/** Plant details: big drawing with tap-to-learn parts, a fun fact, and the plant's quiz. */
export default function PlantDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plant = getPlant(id);
  const router = useRouter();
  const { snapshot, viewPlant, tapPart } = useGame();
  const [selected, setSelected] = useState<PartKey | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [party, setParty] = useState(0);
  const viewed = useRef(false);

  useEffect(() => {
    if (!plant || viewed.current) return;
    viewed.current = true;
    void viewPlant(plant.id).then((earned) => {
      if (earned) {
        setToast(`New plant in your garden! +${earned} leaves`);
        feedback.reward();
      }
    });
  }, [plant, viewPlant]);

  useEffect(() => {
    if (snapshot.profile.autoRead && plant) autoSpeak(`intro-${plant.id}`, plant.intro);
    return () => stopSpeaking();
  }, [plant, snapshot.profile.autoRead]);

  if (!plant) return null;
  const tapped = snapshot.progress[plant.id]?.partsTapped ?? [];
  const part = plant.parts.find((p) => p.key === selected);
  const completed = snapshot.progress[plant.id]?.completed;

  const onPart = async (key: PartKey) => {
    const info = plant.parts.find((p) => p.key === key);
    if (!info) return;
    setSelected(key);
    feedback.tap();
    autoSpeak(`part-${plant.id}-${key}`, `${info.name}. ${info.text}`);
    const earned = await tapPart(plant.id, key, plant.parts.map((p) => p.key));
    if (earned) {
      setToast(`You found every part! +${earned} leaves`);
      setParty((n) => n + 1);
      feedback.reward();
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: plant.theme.pale }}>
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="flex-row items-center gap-3 px-5 pt-2">
          <BackButton />
          <View className="flex-1">
            <Text className="font-heading text-[30px] text-ink">{plant.name}</Text>
            <Text className="font-medium text-[15px] italic text-muted">{plant.scientificName}</Text>
          </View>
          <SpeakButton id={`intro-${plant.id}`} text={plant.intro} />
        </View>

        <ScrollView contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
          <Text className="px-5 pt-2 font-medium text-[18px] leading-[26px] text-ink">{plant.intro}</Text>

          {/* Tap-to-learn drawing */}
          <View className="mx-5 mt-4 items-center overflow-hidden rounded-3xl bg-white pt-3" style={{ borderBottomWidth: 6, borderBottomColor: plant.theme.main }}>
            <View className="mb-1 flex-row items-center gap-1.5 rounded-full px-3 py-1" style={{ backgroundColor: plant.theme.pale }}>
              <Text className="font-semibold text-[14px]" style={{ color: plant.theme.dark }}>
                Tap the parts! {tapped.length}/{plant.parts.length} found
              </Text>
            </View>
            <PlantArt plantId={plant.id} size={250} highlight={selected} onPartPress={onPart} />
          </View>

          {/* Part chips: same as tapping the drawing, and easier for small fingers */}
          <View className="mx-5 mt-3 flex-row flex-wrap gap-2">
            {plant.parts.map((p) => {
              const on = selected === p.key;
              const found = tapped.includes(p.key);
              return (
                <Pressable
                  key={p.key}
                  accessibilityRole="button"
                  accessibilityLabel={p.name}
                  onPress={() => onPart(p.key)}
                  className="flex-row items-center gap-1.5 rounded-2xl px-4 py-2.5"
                  style={{
                    backgroundColor: on ? plant.theme.main : colors.white,
                    borderBottomWidth: 4,
                    borderBottomColor: on ? plant.theme.dark : colors.sandDark,
                  }}>
                  {found ? <Leaf size={15} color={on ? colors.white : colors.leafDark} strokeWidth={2.8} /> : null}
                  <Text className="font-heading text-[17px]" style={{ color: on ? colors.white : colors.ink }}>
                    {p.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {part ? (
            <Animated.View key={part.key} entering={FadeInDown.springify().damping(14)}>
              <View className="mx-5 mt-3 flex-row items-center gap-3 rounded-3xl p-4" style={{ backgroundColor: plant.theme.main, borderBottomWidth: 5, borderBottomColor: plant.theme.dark }}>
                <View className="flex-1">
                  <Text className="font-heading text-[20px] text-white">{part.name}</Text>
                  <Text className="font-medium text-[17px] leading-[24px] text-white">{part.text}</Text>
                </View>
                <SpeakButton id={`part-${plant.id}-${part.key}`} text={`${part.name}. ${part.text}`} size={38} />
              </View>
            </Animated.View>
          ) : null}

          {/* Fun fact */}
          <View className="mx-5 mt-4 flex-row gap-3 rounded-3xl bg-white p-4" style={{ borderWidth: 2.5, borderColor: colors.sun, borderBottomWidth: 6 }}>
            <View className="h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: colors.sun }}>
              <Lightbulb size={24} color={colors.ink} strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Text className="font-heading text-[18px] text-ink">Fun fact!</Text>
              <Text className="font-body text-[17px] leading-[24px] text-ink">{plant.funFact}</Text>
            </View>
            <SpeakButton id={`fact-${plant.id}`} text={`Fun fact! ${plant.funFact}`} size={36} />
          </View>

          <View className="mx-5 mt-6">
            <ChunkyButton
              label={completed ? 'PLAY QUIZ AGAIN' : `TAKE THE ${plant.name.toUpperCase()} QUIZ`}
              variant="grape"
              onPress={() => router.push({ pathname: '/play', params: { plant: plant.id } })}
            />
            {!completed ? (
              <Text className="mt-2 text-center font-medium text-[14px] text-muted">Get 2 of 3 right to unlock the next plant!</Text>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>

      {toast ? (
        <Animated.View entering={ZoomIn.springify()} style={{ position: 'absolute', left: 20, right: 20, top: 96 }}>
          <View className="flex-row items-center gap-2 rounded-2xl px-4 py-3" style={{ backgroundColor: colors.ink }}>
            <Leaf size={20} color={colors.leafLight} />
            <Text className="flex-1 font-semibold text-[16px] text-white">{toast}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => setToast(null)} hitSlop={10}>
              <Text className="font-heading text-[16px] text-sun">OK</Text>
            </Pressable>
          </View>
        </Animated.View>
      ) : null}
      <Confetti playKey={party} />
    </View>
  );
}
