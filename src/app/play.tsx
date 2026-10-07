import { useLocalSearchParams, useRouter } from 'expo-router';
import { Leaf, X } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Binhi, type BinhiMood } from '@/components/art/Binhi';
import { PlantArt } from '@/components/art/PlantArt';
import { ChunkyButton } from '@/components/ChunkyButton';
import { Confetti } from '@/components/Confetti';
import { ProgressBar } from '@/components/ProgressBar';
import { SpeakButton } from '@/components/SpeakButton';
import { getPlant, type PartKey } from '@/data/plants';
import { levelQuiz, plantQuiz, type Level, type Question } from '@/data/questions';
import type { AnswerRecord } from '@/db/queries';
import { feedback } from '@/lib/feedback';
import { goBack } from '@/lib/nav';
import { displayName, stageFor, useGame } from '@/lib/game';
import { colors } from '@/lib/palette';
import { speak, stopSpeaking } from '@/lib/speech';

const LETTER_COLORS = [colors.skyDark, colors.coral, colors.grape, colors.teal];
const CHEERS = ['Amazing!', 'Great job!', 'You got it!', 'Super!', 'Wow!'];

function correctAnswer(q: Question): string {
  return q.kind === 'tap' ? q.answer : String(q.answer);
}

function answerLabel(q: Question): string {
  if (q.kind === 'choice') return q.options[q.answer];
  if (q.kind === 'picture') return getPlant(q.options[q.answer])?.name ?? '';
  return getPlant(q.plantId)?.parts.find((p) => p.key === q.answer)?.name ?? '';
}

/** Runs a quiz. `?plant=sunflower` plays that plant's quiz; `?level=sprout` plays a level quiz. */
export default function Play() {
  const params = useLocalSearchParams<{ plant?: string; level?: Level }>();
  const router = useRouter();
  const { snapshot, finishQuiz } = useGame();
  const plantId = params.plant ?? null;
  const level = plantId ? null : (params.level ?? 'sprout');
  // Where X / DONE lead when the quiz was opened directly and there is no screen behind it.
  const exitTo = plantId ? ({ pathname: '/plant/[id]', params: { id: plantId } } as const) : '/quiz';

  const questions = useMemo(() => (plantId ? plantQuiz(plantId) : levelQuiz(level!)), [plantId, level]);
  const startedAt = useRef(new Date().toISOString());
  const [startLeaves] = useState(snapshot.leaves);
  const [wasCompleted] = useState(plantId ? Boolean(snapshot.progress[plantId]?.completed) : false);

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [hop, setHop] = useState(0);
  const [party, setParty] = useState(0);
  const [hint, setHint] = useState('');
  const [result, setResult] = useState<{ earned: number } | null>(null);

  const q = questions[index];
  const isCorrect = checked && picked === correctAnswer(q);
  const mood: BinhiMood = !checked ? 'happy' : isCorrect ? 'cheer' : 'encourage';

  useEffect(() => {
    if (q && !result && snapshot.profile.autoRead) speak(`q-${q.id}`, q.prompt);
  }, [q, result, snapshot.profile.autoRead]);

  useEffect(() => () => stopSpeaking(), []);

  const check = () => {
    if (!picked) {
      setHint('Pick an answer first!');
      feedback.tryAgain();
      return;
    }
    const correct = picked === correctAnswer(q);
    setChecked(true);
    setAnswers((a) => [...a, { questionId: q.id, chosen: picked, correct }]);
    if (correct) {
      const cheer = CHEERS[Math.floor(Math.random() * CHEERS.length)];
      feedback.correct();
      setHop((h) => h + 1);
      setParty((p) => p + 1);
      speak(`fb-${q.id}`, `${cheer} ${q.explain}`);
    } else {
      feedback.tryAgain();
      speak(`fb-${q.id}`, `Good try! The answer is ${answerLabel(q)}. ${q.explain}`);
    }
  };

  const next = async () => {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setPicked(null);
      setChecked(false);
      setHint('');
      return;
    }
    const score = answers.filter((a) => a.correct).length;
    const passed = plantId ? score >= 2 : true;
    const earned = await finishQuiz({ level, plantId, startedAt: startedAt.current, answers, passed });
    setResult({ earned });
  };

  if (!q) return null;

  if (result) {
    return (
      <Results
        score={answers.filter((a) => a.correct).length}
        total={answers.length}
        earned={result.earned}
        before={startLeaves}
        after={snapshot.leaves}
        name={displayName(snapshot.profile)}
        unlocked={Boolean(plantId && !wasCompleted && snapshot.progress[plantId]?.completed)}
        failedPlant={Boolean(plantId && !snapshot.progress[plantId]?.completed)}
        onAgain={() => router.replace({ pathname: '/play', params: plantId ? { plant: plantId } : { level: level! } })}
        onDone={() => goBack(router, exitTo)}
      />
    );
  }

  const pick = (value: string) => {
    if (checked) return;
    feedback.tap();
    setPicked(value);
    setHint('');
  };

  return (
    <View className="flex-1 bg-cream">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="flex-row items-center gap-3 px-5 pt-2">
          <Pressable accessibilityRole="button" accessibilityLabel="Quit quiz" hitSlop={10} onPress={() => goBack(router, exitTo)}>
            <X size={30} color={colors.faint} strokeWidth={3} />
          </Pressable>
          <View className="flex-1">
            <ProgressBar value={(index + (checked ? 1 : 0)) / questions.length} height={16} />
          </View>
          <View className="flex-row items-center gap-1">
            <Leaf size={18} color={colors.leafDark} strokeWidth={2.8} />
            <Text className="font-heading text-[17px] text-leaf-dark">{snapshot.leaves}</Text>
          </View>
        </View>

        <ScrollView contentContainerClassName="px-5 pb-6" showsVerticalScrollIndicator={false}>
          <Text className="mt-4 font-semibold text-[14px] text-muted">
            Question {index + 1} of {questions.length}
          </Text>
          <Animated.View key={q.id} entering={FadeIn.duration(250)} style={{ marginTop: 8, flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
            <Binhi stage={stageFor(snapshot.leaves).stage} mood={mood} size={70} hopKey={hop} />
            <View className="mb-2 flex-1 flex-row items-center gap-2 rounded-3xl bg-white px-4 py-3" style={{ borderWidth: 2.5, borderColor: colors.sandDark }}>
              <Text className="flex-1 font-heading text-[20px] leading-[26px] text-ink">{q.prompt}</Text>
              <SpeakButton id={`q-${q.id}`} text={q.prompt} size={36} />
            </View>
          </Animated.View>

          <View className="mt-4">
            {q.kind === 'choice' ? (
              <View className="gap-3">
                {q.options.map((opt, i) => (
                  <AnswerCard
                    key={opt}
                    state={stateFor(String(i), picked, checked, correctAnswer(q))}
                    onPress={() => pick(String(i))}
                    accessibilityLabel={opt}>
                    <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: LETTER_COLORS[i] }}>
                      <Text className="font-heading text-[18px] text-white">{'ABCD'[i]}</Text>
                    </View>
                    <Text className="flex-1 font-semibold text-[19px] text-ink">{opt}</Text>
                  </AnswerCard>
                ))}
              </View>
            ) : q.kind === 'picture' ? (
              <View className="flex-row flex-wrap gap-3">
                {q.options.map((pid, i) => (
                  <View key={pid} style={{ width: '47%', flexGrow: 1 }}>
                    <AnswerCard
                      column
                      state={stateFor(String(i), picked, checked, correctAnswer(q))}
                      onPress={() => pick(String(i))}
                      accessibilityLabel={getPlant(pid)?.name ?? pid}>
                      <PlantArt plantId={pid} size={110} variant="compact" />
                      <Text className="font-heading text-[18px] text-ink">{getPlant(pid)?.name}</Text>
                    </AnswerCard>
                  </View>
                ))}
              </View>
            ) : (
              <TapQuestion
                plantId={q.plantId}
                picked={picked as PartKey | null}
                checked={checked}
                answer={q.answer}
                onPick={pick}
              />
            )}
          </View>
        </ScrollView>

        {/* Feedback tray */}
        <Animated.View
          key={`${q.id}-${checked}`}
          entering={checked ? FadeIn.duration(200) : undefined}
          style={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 12,
            backgroundColor: !checked ? colors.white : isCorrect ? colors.leafPale : colors.coralPale,
            borderTopWidth: 2,
            borderTopColor: !checked ? colors.sand : isCorrect ? colors.leafLight : colors.coralLight,
          }}>
          <SafeAreaView edges={['bottom']}>
            {checked ? (
              <View className="mb-3 flex-row items-start gap-2">
                <View className="flex-1">
                  <Text className="font-heading text-[22px]" style={{ color: isCorrect ? colors.leafDark : colors.coralDark }}>
                    {isCorrect ? 'Correct!' : 'Good try!'}
                  </Text>
                  {!isCorrect ? (
                    <Text className="font-semibold text-[16px]" style={{ color: colors.coralDark }}>
                      Answer: {answerLabel(q)}
                    </Text>
                  ) : null}
                  <Text className="font-medium text-[16px] leading-[22px] text-ink">{q.explain}</Text>
                </View>
                <SpeakButton id={`fb-${q.id}`} text={q.explain} size={36} />
              </View>
            ) : (
              <Text className="mb-3 font-semibold text-[16px]" style={{ color: hint ? colors.coralDark : colors.muted }}>
                {hint || (picked ? 'Ready? Tap CHECK!' : q.kind === 'tap' ? 'Tap a part of the plant.' : 'Tap an answer.')}
              </Text>
            )}
            <ChunkyButton
              label={!checked ? 'CHECK' : index + 1 < questions.length ? 'CONTINUE' : 'SEE MY SCORE'}
              variant={checked && !isCorrect ? 'coral' : 'leaf'}
              disabled={!checked && !picked}
              onPress={checked ? next : check}
            />
          </SafeAreaView>
        </Animated.View>
      </SafeAreaView>
      <Confetti playKey={party} />
    </View>
  );
}

type CardState = 'idle' | 'picked' | 'right' | 'wrong' | 'dim';

function stateFor(value: string, picked: string | null, checked: boolean, correct: string): CardState {
  if (!checked) return picked === value ? 'picked' : 'idle';
  if (value === correct) return 'right';
  if (value === picked) return 'wrong';
  return 'dim';
}

const CARD = {
  idle: { bg: colors.white, border: colors.sandDark },
  picked: { bg: colors.skyPale, border: colors.skyDark },
  right: { bg: colors.leafPale, border: colors.leaf },
  wrong: { bg: colors.coralPale, border: colors.coralLight },
  dim: { bg: colors.white, border: colors.sand },
};

function AnswerCard({
  state,
  onPress,
  children,
  column = false,
  accessibilityLabel,
}: {
  state: CardState;
  onPress: () => void;
  children: React.ReactNode;
  column?: boolean;
  accessibilityLabel: string;
}) {
  const c = CARD[state];
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected: state === 'picked' }} accessibilityLabel={accessibilityLabel} onPress={onPress}>
      {({ pressed }) => (
        <View
          style={{
            backgroundColor: c.bg,
            borderWidth: 2.5,
            borderColor: c.border,
            borderBottomWidth: pressed ? 3 : 6,
            marginTop: pressed ? 3 : 0,
            borderRadius: 20,
            padding: column ? 10 : 12,
            minHeight: 64,
            flexDirection: column ? 'column' : 'row',
            alignItems: 'center',
            gap: column ? 2 : 12,
            opacity: state === 'dim' ? 0.55 : 1,
          }}>
          {children}
        </View>
      )}
    </Pressable>
  );
}

function TapQuestion({
  plantId,
  picked,
  checked,
  answer,
  onPick,
}: {
  plantId: string;
  picked: PartKey | null;
  checked: boolean;
  answer: PartKey;
  onPick: (part: string) => void;
}) {
  const plant = getPlant(plantId);
  if (!plant) return null;
  const show = checked ? answer : picked;
  const pickedName = plant.parts.find((p) => p.key === picked)?.name;
  return (
    <View className="items-center rounded-3xl bg-white pt-2" style={{ borderWidth: 2.5, borderColor: checked ? (picked === answer ? colors.leaf : colors.coralLight) : colors.sandDark, borderBottomWidth: 6 }}>
      <PlantArt plantId={plantId} size={230} highlight={show} dimOthers={checked} onPartPress={checked ? undefined : (k) => onPick(k)} />
      <View className="absolute left-3 top-3 rounded-full px-3 py-1" style={{ backgroundColor: pickedName ? colors.skyDark : colors.sand }}>
        <Text className="font-heading text-[15px]" style={{ color: pickedName ? colors.white : colors.muted }}>
          {pickedName ? `You picked: ${pickedName}` : 'Tap a part'}
        </Text>
      </View>
    </View>
  );
}

function Results({
  score,
  total,
  earned,
  before,
  after,
  name,
  unlocked,
  failedPlant,
  onAgain,
  onDone,
}: {
  score: number;
  total: number;
  earned: number;
  before: number;
  after: number;
  name: string;
  unlocked: boolean;
  failedPlant: boolean;
  onAgain: () => void;
  onDone: () => void;
}) {
  const grewUp = stageFor(after).stage !== stageFor(before).stage;
  const perfect = score === total;
  const title = perfect ? 'Perfect score!' : score / total >= 0.6 ? `Great job, ${name}!` : `Nice try, ${name}!`;
  const growth = stageFor(after);
  const line = grewUp
    ? `Wow! Binhi grew into ${growth.name}!`
    : unlocked
      ? 'You unlocked the next plant on your adventure!'
      : failedPlant
        ? 'Get 2 right to unlock the next plant. You can do it!'
        : 'Keep learning to help Binhi grow!';

  useEffect(() => {
    if (grewUp) feedback.levelUp();
    else feedback.reward();
    speak('results', `${title} You got ${score} out of ${total}. You earned ${earned} leaves. ${line}`);
  }, [grewUp, title, score, total, earned, line]);

  return (
    <View className="flex-1" style={{ backgroundColor: grewUp ? colors.sunPale : colors.leafPale }}>
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 justify-between px-6 pb-4">
        <View className="items-center pt-10">
          <Animated.View entering={ZoomIn.springify().damping(10)}>
            <Binhi stage={growth.stage} mood="cheer" size={150} hopKey={1} />
          </Animated.View>
          <Text className="mt-4 text-center font-heading text-[34px] text-ink">{title}</Text>
          <Text className="mt-1 text-center font-medium text-[18px] text-muted">{line}</Text>

          <View className="mt-8 flex-row gap-3 self-stretch">
            <View className="flex-1 items-center rounded-3xl bg-white py-4" style={{ borderBottomWidth: 6, borderBottomColor: colors.sandDark }}>
              <Text className="font-semibold text-[14px] text-muted">SCORE</Text>
              <Text className="font-heading text-[38px] text-ink">
                {score}/{total}
              </Text>
            </View>
            <View className="flex-1 items-center rounded-3xl py-4" style={{ backgroundColor: colors.leaf, borderBottomWidth: 6, borderBottomColor: colors.leafDark }}>
              <Text className="font-semibold text-[14px] text-white">LEAVES</Text>
              <View className="flex-row items-center gap-1">
                <Leaf size={28} color={colors.white} strokeWidth={2.6} />
                <Text className="font-heading text-[38px] text-white">+{earned}</Text>
              </View>
            </View>
          </View>
          <View className="mt-5 self-stretch">
            <Text className="mb-1.5 font-semibold text-[15px] text-muted">
              Binhi is {growth.name}
              {growth.next ? ` · ${growth.toNext} leaves to grow` : ''}
            </Text>
            <ProgressBar value={growth.progress} height={18} />
          </View>
        </View>
        <View className="gap-3">
          <ChunkyButton label="DONE" onPress={onDone} />
          <ChunkyButton label="PLAY AGAIN" variant="white" onPress={onAgain} />
        </View>
      </SafeAreaView>
      <Confetti playKey={1} />
    </View>
  );
}
