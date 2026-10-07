import { BackHandler, Platform } from 'react-native';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { stopSpeaking } from '@/lib/speech';

/**
 * Only Android lets an app close itself. iOS forbids it (App Store rule) and a browser can't close its own tab,
 * so the Exit option is hidden there.
 */
export const canExitApp = Platform.OS === 'android';

/** "Leave PlantQuest?" confirmation. Progress is saved as students go, so nothing is lost by exiting. */
export function ExitDialog({ visible, onCancel }: { visible: boolean; onCancel: () => void }) {
  return (
    <ConfirmDialog
      visible={visible}
      title="Leave PlantQuest?"
      message="Your leaves and garden are saved. Binhi will be waiting for you!"
      cancelLabel="KEEP PLAYING"
      confirmLabel="Exit"
      onCancel={onCancel}
      onConfirm={() => {
        stopSpeaking();
        BackHandler.exitApp();
      }}
    />
  );
}
