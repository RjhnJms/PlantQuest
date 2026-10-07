import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/art/Avatar';
import { ChunkyButton } from '@/components/ChunkyButton';
import { cleanName, GradePicker, MAX_NAME } from '@/components/GradePicker';
import { BackButton } from '@/components/Screen';
import { feedback } from '@/lib/feedback';
import { goBack } from '@/lib/nav';
import { useGame } from '@/lib/game';
import { colors } from '@/lib/palette';

export default function EditProfile() {
  const router = useRouter();
  const { snapshot, updateProfile } = useGame();
  const [name, setName] = useState(snapshot.profile.name ?? '');
  const [grade, setGrade] = useState<number | null>(snapshot.profile.grade);
  const [error, setError] = useState('');

  const save = async () => {
    const clean = cleanName(name);
    if (!clean) {
      setError('Type your name first');
      feedback.tryAgain();
      return;
    }
    await updateProfile({ name: clean, grade });
    feedback.reward();
    goBack(router, '/profile');
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center gap-3 px-5 pt-2">
          <BackButton />
          <Text className="font-heading text-[28px] text-ink">Edit profile</Text>
        </View>
        <ScrollView contentContainerClassName="px-6 pb-6" keyboardShouldPersistTaps="handled">
          <View className="mt-4 items-center">
            <Avatar size={96} />
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
          <ChunkyButton label="SAVE" onPress={save} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
