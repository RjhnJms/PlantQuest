import { Volume2, VolumeX } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { haptic, playSound, setSoundEnabled } from '@/lib/feedback';
import { useGame } from '@/lib/game';
import { colors } from '@/lib/palette';
import { setAutoSpeech } from '@/lib/speech';

/**
 * Sound on/off button. Off silences sound effects and automatic read-aloud (handy in a classroom);
 * a speaker button that a student taps on purpose still reads aloud.
 */
export function SoundToggle({ size = 40 }: { size?: number }) {
  const { snapshot, updateProfile } = useGame();
  const on = snapshot.profile.soundOn;
  const Icon = on ? Volume2 : VolumeX;

  const toggle = () => {
    const next = !on;
    haptic('tap');
    // Apply right away, before the save finishes.
    setSoundEnabled(next);
    setAutoSpeech(next);
    if (next) playSound('tap');
    void updateProfile({ soundOn: next });
  };

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={on ? 'Sound is on. Tap to turn sound off.' : 'Sound is off. Tap to turn sound on.'}
      hitSlop={8}
      onPress={toggle}>
      {({ pressed }) => (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: on ? colors.white : colors.sand,
            borderBottomWidth: pressed ? 1 : 3,
            borderBottomColor: colors.sandDark,
            marginTop: pressed ? 2 : 0,
          }}>
          <Icon size={size * 0.5} color={on ? colors.skyDark : colors.faint} strokeWidth={2.6} />
        </View>
      )}
    </Pressable>
  );
}
