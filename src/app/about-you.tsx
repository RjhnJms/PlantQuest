import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Binhi } from '@/components/art/Binhi';
import { ChunkyButton } from '@/components/ChunkyButton';
import { BackButton } from '@/components/Screen';
import { SpeakButton } from '@/components/SpeakButton';
import { cleanName, GradePicker, MAX_NAME } from '@/components/GradePicker';
import { feedback } from '@/lib/feedback';
import { useGame } from '@/lib/game';
import { colors } from '@/lib/palette';

/** Screen 3: About you. Asked once; only a first name or nickname, nothing else personal. */
export default function AboutYou() {
  const { updateProfile } = useGame();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<number | null>(null);
  const [error, setError] = useState('');
  const clean = cleanName(name);

  const finish = async (skip: boolean) => {
    if (!skip && !clean) {
      setError('Type your name first');
      feedback.tryAgain();
      return;
    }
    // Flipping `onboarded` swaps the navigator over to the main app (see the root layout).
    await updateProfile(skip ? { onboarded: true } : { name: clean, grade, onboarded: true });
    feedback.reward();
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center justify-between px-5 pt-2">
          <BackButton />
          <Pressable accessibilityRole="button" onPress={() => finish(true)} hitSlop={10}>
            <Text className="font-semibold text-[17px] text-muted">Skip</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerClassName="px-6 pb-6" keyboardShouldPersistTaps="handled">
          <View className="mt-2 flex-row items-end gap-3">
            <Binhi stage="sprout" mood="happy" size={76} />
            <View className="mb-3 flex-1 rounded-3xl bg-white px-4 py-3" style={{ borderWidth: 2.5, borderColor: colors.sandDark }}>
              <Text className="font-semibold text-[18px] text-ink">Hi! I am Binhi. What should I call you?</Text>
            </View>
            <View className="mb-4">
              <SpeakButton id="about-you" text="Hi! I am Binhi. What should I call you? And what grade are you in?" size={36} />
            </View>
          </View>

          <Text className="mb-2 mt-6 font-heading text-[20px] text-ink">Your name</Text>
          <TextInput
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (error) setError('');
            }}
            placeholder="Jamie"
            placeholderTextColor={colors.faint}
            maxLength={MAX_NAME}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            accessibilityLabel="Your name"
            className="rounded-3xl bg-white px-5 font-semibold text-[22px] text-ink"
            style={{ height: 64, borderWidth: 2.5, borderColor: error ? colors.coral : colors.sandDark, borderBottomWidth: 6 }}
          />
          <Text className="mt-1.5 font-medium text-[14px]" style={{ color: error ? colors.coralDark : colors.muted }}>
            {error || 'Just your first name or a nickname.'}
          </Text>

          <Text className="mb-3 mt-6 font-heading text-[20px] text-ink">Your grade</Text>
          <GradePicker value={grade} onChange={setGrade} />
        </ScrollView>

        <View className="px-6 pb-2">
          <ChunkyButton label={clean ? `LET'S GO, ${clean.toUpperCase()}!` : "LET'S GO!"} disabled={!clean} onPress={() => finish(false)} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
