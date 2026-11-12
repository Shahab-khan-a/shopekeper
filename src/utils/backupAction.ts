import type { AlertConfig } from '@/context/ShopContext';

interface TriggerCloudBackupParams {
  user: unknown;
  isOnline: boolean;
  pendingSyncCount: number;
  isUrdu: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  syncNow: () => Promise<unknown> | void;
  showAlert: (options: AlertConfig) => void;
}

/**
 * Shared handler for initiating Google Drive backup, immediate sync, or offline feedback.
 */
export async function triggerCloudBackupFlow({
  user,
  isOnline,
  pendingSyncCount,
  isUrdu,
  setIsAuthModalOpen,
  syncNow,
  showAlert,
}: TriggerCloudBackupParams): Promise<void> {
  if (!user) {
    setIsAuthModalOpen(true);
    return;
  }
  if (!isOnline) {
    showAlert({
      type: 'info',
      title: isUrdu ? 'آف لائن موڈ' : 'Offline Mode',
      message: isUrdu
        ? 'انٹرنیٹ نہیں ہے۔ آپ کا ریکارڈ فون میں محفوظ ہے اور انٹرنیٹ آتے ہی بیک اپ ہو جائے گا۔'
        : 'You are offline. Your records stay safely on this phone and will back up when internet returns.',
    });
    return;
  }
  if (pendingSyncCount > 0) {
    await syncNow();
  } else {
    setIsAuthModalOpen(true);
  }
}

