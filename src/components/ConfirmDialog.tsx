import { Modal, Pressable, Text, View } from 'react-native';

import { Binhi } from '@/components/art/Binhi';
import { ChunkyButton } from '@/components/ChunkyButton';
import { colors } from '@/lib/palette';

/**
 * In-app yes/no window. Used instead of system popups, which look out of place for kids and are blocked
 * entirely in some browsers (window.confirm returns "cancel" without showing anything).
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable accessibilityLabel="Close" onPress={onCancel} className="flex-1 items-center justify-center px-6" style={{ backgroundColor: 'rgba(43,45,66,0.55)' }}>
        {/* Inner Pressable swallows taps so tapping the card doesn't close it. */}
        <Pressable onPress={() => {}} className="w-full max-w-[420px] items-center rounded-3xl bg-cream px-5 pb-5 pt-6" style={{ borderBottomWidth: 8, borderBottomColor: colors.sandDark }}>
          <Binhi stage="sprout" mood="encourage" size={86} bob={false} />
          <Text className="mt-3 text-center font-heading text-[26px] text-ink">{title}</Text>
          <Text className="mt-1 text-center font-medium text-[17px] leading-[24px] text-muted">{message}</Text>
          <View className="mt-5 gap-3 self-stretch">
            <ChunkyButton label={cancelLabel} onPress={onCancel} />
            <ChunkyButton label={confirmLabel} variant="coral" size="md" onPress={onConfirm} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
