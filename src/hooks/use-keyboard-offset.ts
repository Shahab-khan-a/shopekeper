import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Bottom padding that keeps a sheet inside an Android `Modal` above the keyboard.
 *
 * Android modals are edge-to-edge, so the keyboard overlaps them instead of resizing them.
 * RN reports the keyboard height minus the nav bar, but the sheet extends behind the nav bar,
 * so that inset is added back. Updates once per show/hide (no layout feedback loop).
 * Always 0 on iOS/web, where `KeyboardAvoidingView behavior="padding"` handles it.
 */
export function useKeyboardOffset(active: boolean): number {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!active || Platform.OS !== 'android') return;
    setKeyboardHeight(Keyboard.isVisible() ? (Keyboard.metrics()?.height ?? 0) : 0);
    const showSub = Keyboard.addListener('keyboardDidShow', (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [active]);

  return keyboardHeight > 0 ? keyboardHeight + insets.bottom : 0;
}
