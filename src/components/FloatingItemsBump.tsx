import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useShop } from '@/context/ShopContext';

const STORAGE_KEY = '@shopkeeper_items_bump_state_v1';

const MAX_W = 76;
const MAX_H = 88;
const MIN_W = 30;
const MIN_H = 66;
const TOP_BOUND = 14;
const BOTTOM_GUARD = 74; // Keep cleanly above bottom Cash/Udhaar checkout bar

interface FloatingItemsBumpProps {
  containerHeight: number;
  onPressOpen: () => void;
}

interface PersistedBumpState {
  yRatio: number;
  minimized: boolean;
}

/**
 * Floating right-edge connected bump handle with custom visual artwork.
 * Supports:
 * - Tap (maximized): opens right-side Items sidebar.
 * - Minimize / Maximize toggle: collapses smoothly to a slim edge tab.
 * - Touch & drag: glides vertically along the right edge and persists position.
 */
export const FloatingItemsBump: React.FC<FloatingItemsBumpProps> = ({
  containerHeight,
  onPressOpen,
}) => {
  const { settings, language } = useShop();
  const isUrdu = language === 'ur';

  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasLoadedState, setHasLoadedState] = useState(false);

  const savedRatioRef = useRef(0.46);
  const isMinimizedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const currentYRef = useRef(180);
  const dragStartYRef = useRef(180);
  const maxTravelRef = useRef({ minY: TOP_BOUND, maxY: 320 });

  // Animated values
  const panY = useRef(new Animated.Value(180)).current;
  const morphAnim = useRef(new Animated.Value(1)).current; // 1 = maximized, 0 = minimized
  const dragScale = useRef(new Animated.Value(1)).current;
  const floatOffset = useRef(new Animated.Value(0)).current;

  const getBounds = useCallback(
    (minimizedState: boolean) => {
      const h = minimizedState ? MIN_H : MAX_H;
      const safeH = containerHeight > 180 ? containerHeight : 600;
      const minY = TOP_BOUND;
      const maxY = Math.max(minY + 12, safeH - h - BOTTOM_GUARD);
      return { minY, maxY };
    },
    [containerHeight]
  );

  // Sync bounds & reposition smoothly when container height changes
  useEffect(() => {
    const bounds = getBounds(isMinimized);
    maxTravelRef.current = bounds;
    if (!hasLoadedState) return;
    const targetY =
      bounds.minY + savedRatioRef.current * (bounds.maxY - bounds.minY);
    const clamped = Math.min(bounds.maxY, Math.max(bounds.minY, targetY));
    currentYRef.current = clamped;
    panY.setValue(clamped);
  }, [containerHeight, isMinimized, hasLoadedState, getBounds, panY]);

  // Load persisted position and minimized preference
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active) return;
        let nextRatio = 0.46;
        let nextMin = false;
        if (raw) {
          try {
            const parsed: Partial<PersistedBumpState> = JSON.parse(raw);
            if (typeof parsed.yRatio === 'number' && isFinite(parsed.yRatio)) {
              nextRatio = Math.min(1, Math.max(0, parsed.yRatio));
            }
            if (typeof parsed.minimized === 'boolean') {
              nextMin = parsed.minimized;
            }
          } catch {
            // ignore malformed storage
          }
        }
        savedRatioRef.current = nextRatio;
        isMinimizedRef.current = nextMin;
        setIsMinimized(nextMin);
        morphAnim.setValue(nextMin ? 0 : 1);

        const bounds = getBounds(nextMin);
        maxTravelRef.current = bounds;
        const initY = bounds.minY + nextRatio * (bounds.maxY - bounds.minY);
        currentYRef.current = initY;
        panY.setValue(initY);
        setHasLoadedState(true);
      })
      .catch(() => {
        if (!active) return;
        setHasLoadedState(true);
      });

    return () => {
      active = false;
    };
  }, [getBounds, morphAnim, panY]);

  const persistState = useCallback((ratio: number, minimized: boolean) => {
    const cleanRatio = Math.min(1, Math.max(0, ratio));
    savedRatioRef.current = cleanRatio;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ yRatio: cleanRatio, minimized })
    ).catch(() => {});
  }, []);

  // Gentle fluid floating loop when idle & maximized
  useEffect(() => {
    if (isMinimized || isDragging) {
      floatOffset.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatOffset, {
          toValue: -3.5,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatOffset, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isMinimized, isDragging, floatOffset]);

  const setMinimizedFluid = useCallback(
    (nextMin: boolean) => {
      isMinimizedRef.current = nextMin;
      setIsMinimized(nextMin);
      Animated.spring(morphAnim, {
        toValue: nextMin ? 0 : 1,
        speed: 16,
        bounciness: 7,
        useNativeDriver: false,
      }).start();
      persistState(savedRatioRef.current, nextMin);
    },
    [morphAnim, persistState]
  );

  const onPressOpenRef = useRef(onPressOpen);
  onPressOpenRef.current = onPressOpen;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) =>
          isDraggingRef.current || Math.abs(g.dy) > 6,
        onPanResponderTerminationRequest: () => !isDraggingRef.current,
        onPanResponderGrant: () => {
          dragStartYRef.current = currentYRef.current;
          isDraggingRef.current = false;

          Animated.spring(dragScale, {
            toValue: 0.95,
            speed: 28,
            bounciness: 4,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderMove: (_, gestureState) => {
          if (!isDraggingRef.current) {
            if (Math.abs(gestureState.dy) <= 6) return;
            isDraggingRef.current = true;
            setIsDragging(true);
            Animated.spring(dragScale, {
              toValue: 1.07,
              speed: 22,
              bounciness: 6,
              useNativeDriver: true,
            }).start();
          }

          const { minY, maxY } = maxTravelRef.current;
          const nextY = Math.min(
            maxY,
            Math.max(minY, dragStartYRef.current + gestureState.dy)
          );
          currentYRef.current = nextY;
          panY.setValue(nextY);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDragging(false);
            Animated.spring(dragScale, {
              toValue: 1,
              speed: 18,
              bounciness: 8,
              useNativeDriver: true,
            }).start();

            const { minY, maxY } = maxTravelRef.current;
            const span = Math.max(1, maxY - minY);
            const newRatio = (currentYRef.current - minY) / span;
            persistState(newRatio, isMinimizedRef.current);
            return;
          }

          Animated.spring(dragScale, {
            toValue: 1,
            speed: 22,
            bounciness: 8,
            useNativeDriver: true,
          }).start();

          // Treat as clean tap if minimal movement
          if (Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10) {
            if (isMinimizedRef.current) {
              setMinimizedFluid(false);
            } else {
              onPressOpenRef.current();
            }
          }
        },
        onPanResponderTerminate: () => {
          if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDragging(false);
          }
          Animated.spring(dragScale, {
            toValue: 1,
            speed: 18,
            bounciness: 8,
            useNativeDriver: true,
          }).start();
        },
      }),
    [dragScale, panY, persistState, setMinimizedFluid]
  );

  // Morph interpolations between slim tab (0) and rounded basket bump (1)
  const shellWidth = morphAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [MIN_W, MAX_W],
  });
  const shellHeight = morphAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [MIN_H, MAX_H],
  });
  const shellRadius = morphAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [MIN_H / 2, MAX_H / 2],
  });
  const rightShellRadius = morphAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [MIN_W / 2, 26],
  });
  const artOpacity = morphAnim.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0, 0, 1],
  });
  const artScale = morphAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });
  const miniIconOpacity = morphAnim.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [1, 0, 0],
  });

  if (!hasLoadedState) return null;

  return (
    <Animated.View
      style={[
        styles.anchorWrap,
        { top: panY },
      ]}>
      {/* Drag guidance chevrons shown only while actively dragging */}
      {isDragging && (
        <View pointerEvents="none" style={styles.dragArrowsOverlay}>
          <Ionicons
            name="caret-up"
            size={14}
            color={settings.darkMode ? '#6EE7B7' : '#059669'}
            style={styles.dragArrowTop}
          />
          <Ionicons
            name="caret-down"
            size={14}
            color={settings.darkMode ? '#6EE7B7' : '#059669'}
            style={styles.dragArrowBottom}
          />
        </View>
      )}

      {/* Inner animated scale & idle float container */}
      <Animated.View
        style={{
          transform: [{ translateY: floatOffset }, { scale: dragScale }],
        }}>
        {/* Connected right-edge organic bump shell */}
        <Animated.View
          {...panResponder.panHandlers}
          accessibilityRole="button"
          accessibilityLabel={
            isMinimized
              ? isUrdu
                ? 'آئٹم بٹن بڑا کریں'
                : 'Expand items button'
              : isUrdu
                ? 'اشیاء کی فہرست کھولیں'
                : 'Open items sidebar'
          }
          style={[
            styles.bumpShell,
            {
              width: shellWidth,
              height: shellHeight,
              borderTopLeftRadius: shellRadius,
              borderBottomLeftRadius: shellRadius,
              borderTopRightRadius: rightShellRadius,
              borderBottomRightRadius: rightShellRadius,
              backgroundColor: settings.darkMode ? '#047857' : '#059669',
              borderColor: isDragging
                ? '#FDE047'
                : settings.darkMode
                  ? 'rgba(110, 231, 183, 0.55)'
                  : 'rgba(167, 243, 208, 0.9)',
            },
          ]}>
          {/* Subtle right-edge grip dots hinting press-and-hold drag */}
          <View pointerEvents="none" style={styles.rightGripDots}>
            <View style={styles.gripDot} />
            <View style={styles.gripDot} />
            <View style={styles.gripDot} />
          </View>

          {/* Maximized visual artwork (needs zero explanatory text) */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.artWrap,
              {
                opacity: artOpacity,
                transform: [{ scale: artScale }],
              },
            ]}>
            <Image
              source={require('../../assets/images/items-bump-art.png')}
              style={styles.artImage}
              contentFit="contain"
            />
          </Animated.View>

          {/* Minimized sleek expand chevron + emerald dot */}
          <Animated.View
            pointerEvents="none"
            style={[styles.miniWrap, { opacity: miniIconOpacity }]}>
            <View style={styles.miniDot} />
            <Ionicons name="chevron-back" size={16} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>

        {/* Dedicated Minimize Chip centered vertically on the bump apex when maximized */}
        {!isMinimized && (
          <Pressable
            onPress={() => setMinimizedFluid(true)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isUrdu ? 'چھوٹا کریں' : 'Minimize items bump'}
            style={({ pressed }) => [
              styles.minimizeChip,
              {
                backgroundColor: settings.darkMode ? '#0F172A' : '#FFFFFF',
                borderColor: settings.darkMode
                  ? 'rgba(110, 231, 183, 0.55)'
                  : '#059669',
              },
              pressed && { opacity: 0.85, transform: [{ scale: 0.9 }] },
            ]}>
            <MaterialCommunityIcons
              name="arrow-collapse-right"
              size={14}
              color={settings.darkMode ? '#6EE7B7' : '#059669'}
            />
          </Pressable>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  anchorWrap: {
    position: 'absolute',
    right: 4,
    zIndex: 35,
  },
  dragArrowsOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragArrowTop: {
    position: 'absolute',
    top: -18,
  },
  dragArrowBottom: {
    position: 'absolute',
    bottom: -18,
  },
  bumpShell: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    elevation: 6,
    shadowColor: '#059669',
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  rightGripDots: {
    position: 'absolute',
    right: 4,
    gap: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  gripDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1FAE5',
  },
  artWrap: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 4,
  },
  artImage: {
    width: 52,
    height: 52,
  },
  miniWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingRight: 3,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FDE047',
  },
  minimizeChip: {
    position: 'absolute',
    top: (MAX_H - 26) / 2,
    left: -13,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    elevation: 7,
  },
});

