import { Volume2, VolumeX } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { colors } from '@/lib/palette';
import { toggleSpeak, useSpeakingId } from '@/lib/speech';

/** Speaker button that reads `text` aloud. Pulses while speaking; tap again to stop. */
export function SpeakButton({ id, text, size = 40 }: { id: string; text: string; size?: number }) {
  const speaking = useSpeakingId() === id;
  const scale = useSharedValue(1);

  useEffect(() => {
    if (speaking) scale.set(withRepeat(withTiming(1.12, { duration: 450 }), -1, true));
    else {
      cancelAnimation(scale);
      scale.set(withTiming(1));
    }
  }, [speaking, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const Icon = speaking ? VolumeX : Volume2;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={speaking ? 'Stop reading' : 'Read aloud'}
      hitSlop={8}
      onPress={() => toggleSpeak(id, text)}>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: speaking ? colors.skyDark : colors.skyPale,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: 3,
            borderBottomColor: speaking ? '#2F98D0' : '#BFE6F8',
          },
          style,
        ]}>
        <Icon size={size * 0.5} color={speaking ? colors.white : colors.skyDark} strokeWidth={2.5} />
      </Animated.View>
    </Pressable>
  );
}
