import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
  useFonts,
} from '@expo-google-fonts/fredoka';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { LoadingScreen } from '@/components/LoadingScreen';
import { DATABASE_NAME, migrateDbIfNeeded } from '@/db/schema';
import { setSoundEnabled } from '@/lib/feedback';
import { GameProvider, useGame } from '@/lib/game';
import { colors } from '@/lib/palette';
import { listBinhiVoices, setAutoSpeech, setSpeechRate, setVoice, setVoiceStyle } from '@/lib/speech';

import '../global.css';

SplashScreen.preventAutoHideAsync();

/** Friendly screen instead of a crash if any route fails while rendering. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.cream }}>
      <Text style={{ fontSize: 24, fontWeight: '700', color: colors.ink, marginBottom: 8 }}>Oops! A leaf fell off.</Text>
      <Text style={{ fontSize: 16, color: colors.muted, textAlign: 'center', marginBottom: 20 }}>
        Your progress is safe. {__DEV__ ? error.message : 'Tap the button to try again.'}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={retry}
        style={{ backgroundColor: colors.leaf, borderRadius: 20, paddingHorizontal: 28, paddingVertical: 14, borderBottomWidth: 5, borderBottomColor: colors.leafDark }}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>Try again</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Fredoka_400Regular, Fredoka_500Medium, Fredoka_600SemiBold, Fredoka_700Bold });
  const [appReady, setAppReady] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const fontsReady = fontsLoaded || Boolean(fontError);
  const markReady = useCallback(() => setAppReady(true), []);
  const finishLoading = useCallback(() => setLoadingDone(true), []);

  // Hand over from the phone's splash image to our own loading screen as soon as fonts are in.
  useEffect(() => {
    if (fontsReady) void SplashScreen.hideAsync();
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* The app loads underneath while the loading screen's bar fills on top. */}
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
        <GameProvider>
          <RootNavigator onReady={markReady} />
        </GameProvider>
      </SQLiteProvider>
      {!loadingDone ? <LoadingScreen ready={appReady} onDone={finishLoading} /> : null}
    </GestureHandlerRootView>
  );
}

function RootNavigator({ onReady }: { onReady: () => void }) {
  const { snapshot } = useGame();
  const { onboarded, speechRate, soundOn, voiceId, voiceStyle } = snapshot.profile;

  useEffect(() => {
    setSpeechRate(speechRate);
  }, [speechRate]);

  // Binhi's voice: use the saved one if this phone still has it, otherwise the best offline voice.
  useEffect(() => {
    setVoiceStyle(voiceStyle);
    let active = true;
    void listBinhiVoices().then((voices) => {
      if (active) setVoice(voiceId && voices.some((v) => v.id === voiceId) ? voiceId : null);
    });
    return () => {
      active = false;
    };
  }, [voiceId, voiceStyle]);

  useEffect(() => {
    setSoundEnabled(soundOn);
    setAutoSpeech(soundOn);
  }, [soundOn]);

  // Mounted only once the database and profile are loaded (GameProvider waits for them).
  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream }, animation: 'slide_from_right' }}>
        {/* Welcome screens show until the student finishes "About you" (or skips it). */}
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="welcome" />
          <Stack.Screen name="get-started" />
          <Stack.Screen name="about-you" />
        </Stack.Protected>
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="plant/[id]" />
          <Stack.Screen name="play" options={{ gestureEnabled: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
          <Stack.Screen name="settings" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
