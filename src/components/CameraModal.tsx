import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

interface CameraModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (imageUri: string) => void;
  title?: string;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  visible,
  onClose,
  onCapture,
  title = 'Take Product Photo',
}) => {
  const { settings, t } = useShop();
  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const [stream, setStream] = useState<any>(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (visible) {
      setCapturedUri(null);
      setCameraError(null);

      if (Platform.OS === 'web') {
        startWebCamera();
      } else {
        launchNativeCamera();
      }
    } else {
      stopWebCamera();
    }

    return () => {
      stopWebCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, facingMode]);

  const launchNativeCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('warningAlert'),
          'Camera permission is needed to take pictures of products.'
        );
        onClose();
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        onCapture(result.assets[0].uri);
        onClose();
      } else {
        onClose();
      }
    } catch (e) {
      console.warn('Native camera error:', e);
      onClose();
    }
  };

  const startWebCamera = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('Webcam not supported in this browser. Please use file upload.');
      return;
    }

    try {
      if (stream) {
        stream.getTracks().forEach((track: any) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(newStream);
      setCameraError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Webcam stream error:', err);
      setCameraError(
        'Unable to access camera. Check browser permissions or click "Choose File".'
      );
    }
  };

  const stopWebCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track: any) => track.stop());
      setStream(null);
    }
  };

  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 800;
      canvas.height = video.videoHeight || 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedUri(dataUrl);
        stopWebCamera();
      }
    } catch (e) {
      console.error('Snap photo error:', e);
    }
  };

  const handlePickFile = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (ev: any) => {
        const file = ev.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
            if (loadEvent.target?.result) {
              const res = loadEvent.target.result as string;
              onCapture(res);
              handleClose();
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      }).then((result) => {
        if (!result.canceled && result.assets && result.assets[0]?.uri) {
          onCapture(result.assets[0].uri);
          handleClose();
        }
      });
    }
  };

  const handleConfirmCaptured = () => {
    if (capturedUri) {
      onCapture(capturedUri);
      handleClose();
    }
  };

  const handleRetake = () => {
    setCapturedUri(null);
    startWebCamera();
  };

  const handleClose = () => {
    stopWebCamera();
    setCapturedUri(null);
    onClose();
  };

  // If on native, modal is invisible while system camera is open
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIconCircle, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="camera" size={20} color={theme.primary} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            </View>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* Camera Viewfinder / Preview */}
          <View style={styles.cameraBoxWrap}>
            {capturedUri ? (
              <View style={styles.capturedPreviewContainer}>
                <Image source={{ uri: capturedUri }} style={styles.capturedImage} />
                <View style={styles.successBadge}>
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.successBadgeText}>Photo Captured</Text>
                </View>
              </View>
            ) : cameraError ? (
              <View style={[styles.errorContainer, { backgroundColor: theme.surfaceSubtle }]}>
                <Ionicons name="warning-outline" size={48} color={theme.warning} />
                <Text style={[styles.errorText, { color: theme.text }]}>{cameraError}</Text>
                <Pressable
                  onPress={handlePickFile}
                  style={[styles.actionBtn, { backgroundColor: theme.primary }]}>
                  <Ionicons name="image-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>{t('chooseGallery')}</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.videoContainer}>
                {/* HTML video element embedded for Web */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000000',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                  <video
                    ref={(el) => {
                      videoRef.current = el;
                      if (el && stream && el.srcObject !== stream) {
                        el.srcObject = stream;
                        el.play().catch(() => {});
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>

                {/* Viewfinder Reticle Overlay */}
                <View style={styles.reticleOverlay} pointerEvents="none">
                  <View style={styles.reticleBorder} />
                  <Text style={styles.reticlePrompt}>Align product inside frame</Text>
                </View>

                {/* Flip camera toggle button */}
                <Pressable
                  onPress={() =>
                    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
                  }
                  style={styles.flipBtn}>
                  <Ionicons name="camera-reverse-outline" size={22} color="#FFFFFF" />
                </Pressable>
              </View>
            )}
          </View>

          {/* Controls Footer */}
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            {capturedUri ? (
              <View style={styles.confirmRow}>
                <Pressable
                  onPress={handleRetake}
                  style={[styles.footerBtn, styles.retakeBtn, { borderColor: theme.border }]}>
                  <Ionicons name="refresh" size={18} color={theme.text} />
                  <Text style={[styles.footerBtnText, { color: theme.text }]}>Retake</Text>
                </Pressable>

                <Pressable
                  onPress={handleConfirmCaptured}
                  style={[styles.footerBtn, styles.usePhotoBtn, { backgroundColor: theme.primary }]}>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  <Text style={[styles.footerBtnText, { color: '#FFFFFF' }]}>Use This Photo</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.shutterRow}>
                <Pressable
                  onPress={handlePickFile}
                  style={[styles.fileBtn, { backgroundColor: theme.surfaceSubtle }]}>
                  <Ionicons name="folder-open-outline" size={18} color={theme.text} />
                  <Text style={[styles.fileBtnText, { color: theme.text }]}>Upload</Text>
                </Pressable>

                {/* Big Camera Shutter Button */}
                <Pressable
                  onPress={handleSnapPhoto}
                  style={({ pressed }) => [
                    styles.shutterBtn,
                    { backgroundColor: theme.primary },
                    pressed && { transform: [{ scale: 0.94 }] },
                  ]}>
                  <View style={styles.innerShutterCircle}>
                    <Ionicons name="camera" size={26} color="#FFFFFF" />
                  </View>
                </Pressable>

                <Pressable onPress={handleClose} style={styles.cancelLinkBtn}>
                  <Text style={[styles.cancelLinkText, { color: theme.textSecondary }]}>
                    {t('cancel')}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
  },
  cameraBoxWrap: {
    width: '100%',
    height: 380,
    backgroundColor: '#000000',
    position: 'relative',
    overflow: 'hidden',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  reticleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleBorder: {
    width: '78%',
    height: '75%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    borderStyle: 'dashed',
    borderRadius: BorderRadius.lg,
  },
  reticlePrompt: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    marginTop: 12,
  },
  flipBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    padding: 10,
    borderRadius: BorderRadius.full,
  },
  capturedPreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  successBadge: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(5, 150, 105, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  successBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 320,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  shutterBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  innerShutterCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
  },
  fileBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cancelLinkBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelLinkText: {
    fontSize: 13,
    fontWeight: '600',
  },
  confirmRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  footerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  retakeBtn: {
    borderWidth: 1,
  },
  usePhotoBtn: {
    ...Shadows.sm,
  },
  footerBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
