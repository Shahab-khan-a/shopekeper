import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image, ImageSource } from 'expo-image';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';

const AUTO_ADVANCE_DELAY_MS = 2000;
const CARD_GAP = 12;
const CARD_HEIGHT = 174;

const DOT_INACTIVE_WIDTH = 7;
const DOT_ACTIVE_WIDTH = 26;
const DOT_HEIGHT = 7;
const DOT_GAP = 6;

export type FeatureSlideAction =
  | { type: 'tab'; tab: 'sale' | 'khata' | 'products' | 'history' | 'settings' }
  | { type: 'backup' };

interface FeatureSlide {
  id: string;
  lightImage: ImageSource;
  darkImage: ImageSource;
  accent: string;
  lightAccent: string;
  icon: keyof typeof Ionicons.glyphMap;
  tagEn: string;
  tagUr: string;
  titleEn: string;
  titleUr: string;
  subtitleEn: string;
  subtitleUr: string;
  ctaEn: string;
  ctaUr: string;
  action: FeatureSlideAction;
}

const SLIDES: FeatureSlide[] = [
  {
    id: 'quick-bill',
    lightImage: require('../../assets/images/carousel/slide-billing-light.jpg'),
    darkImage: require('../../assets/images/carousel/slide-billing.jpg'),
    accent: '#10B981',
    lightAccent: '#059669',
    icon: 'calculator-outline',
    tagEn: 'Quick Bill',
    tagUr: 'تیز بلنگ',
    titleEn: '2-Tap Counter Billing',
    titleUr: '2 کلک میں فوری بل',
    subtitleEn: 'Fast calculator billing — cash or split udhaar.',
    subtitleUr: 'کیلکولیٹر کی طرح تیز بل — نقد یا ادھار فوراً۔',
    ctaEn: 'Try Billing',
    ctaUr: 'بل بنائیں',
    action: { type: 'tab', tab: 'sale' },
  },
  {
    id: 'smart-khata',
    lightImage: require('../../assets/images/carousel/slide-khata-light.jpg'),
    darkImage: require('../../assets/images/carousel/slide-khata.jpg'),
    accent: '#FB7185',
    lightAccent: '#E11D48',
    icon: 'book-outline',
    tagEn: 'Digital Khata',
    tagUr: 'ڈیجیٹل کھاتہ',
    titleEn: 'Udhaar & WhatsApp Alerts',
    titleUr: 'ادھار کھاتہ اور واٹس ایپ',
    subtitleEn: '1-tap Gave/Got entries & WhatsApp alerts.',
    subtitleUr: '1 کلک میں دیے یا لیے درج کریں اور واٹس ایپ بھیجیں۔',
    ctaEn: 'Open Khata',
    ctaUr: 'کھاتہ کھولیں',
    action: { type: 'tab', tab: 'khata' },
  },
  {
    id: 'inventory-scan',
    lightImage: require('../../assets/images/carousel/slide-inventory-light.jpg'),
    darkImage: require('../../assets/images/carousel/slide-inventory.jpg'),
    accent: '#38BDF8',
    lightAccent: '#0284C7',
    icon: 'barcode-outline',
    tagEn: 'Stock & Scan',
    tagUr: 'اسٹاک اور اسکین',
    titleEn: 'Fast Barcode & Stock Alerts',
    titleUr: 'بارکوڈ اسکین اور اسٹاک',
    subtitleEn: 'Scan barcodes & catch low-stock items early.',
    subtitleUr: 'بارکوڈ اسکین کریں اور کم اسٹاک کی اطلاع پائیں۔',
    ctaEn: 'View Items',
    ctaUr: 'سامان دیکھیں',
    action: { type: 'tab', tab: 'products' },
  },
  {
    id: 'offline-backup',
    lightImage: require('../../assets/images/carousel/slide-offline-sync-light.jpg'),
    darkImage: require('../../assets/images/carousel/slide-offline-sync.jpg'),
    accent: '#34D399',
    lightAccent: '#047857',
    icon: 'shield-checkmark-outline',
    tagEn: 'Offline Safe',
    tagUr: 'آف لائن محفوظ',
    titleEn: 'Works Offline, Backs Up Safe',
    titleUr: 'بغیر انٹرنیٹ چلے، بیک اپ محفوظ',
    subtitleEn: 'Works offline; sync anytime to Google Drive.',
    subtitleUr: 'بغیر انٹرنیٹ چلے، گوگل ڈرائیو پر بیک اپ محفوظ۔',
    ctaEn: 'Check Backup',
    ctaUr: 'بیک اپ دیکھیں',
    action: { type: 'backup' },
  },
];

interface CarouselCardProps {
  slide: FeatureSlide;
  index: number;
  cardWidth: number;
  scrollX: SharedValue<number>;
  anchors: readonly [number, number, number, number];
  reducedMotion: boolean;
  isDark: boolean;
  isUrdu: boolean;
  onPress: (action: FeatureSlideAction) => void;
}

const CarouselCard: React.FC<CarouselCardProps> = React.memo(
  ({ slide, index, cardWidth, scrollX, anchors, reducedMotion, isDark, isUrdu, onPress }) => {
    const anchor = anchors[index];

    const animatedCardStyle = useAnimatedStyle(() => {
      if (reducedMotion) {
        return {};
      }
      const stride = anchors[1] || 300;
      const distance = Math.abs(scrollX.get() - anchor);
      const progress = Math.min(1, distance / Math.max(1, stride));
      const scale = interpolate(progress, [0, 1], [1, 0.945], Extrapolation.CLAMP);
      const opacity = interpolate(progress, [0, 1], [1, 0.84], Extrapolation.CLAMP);

      return {
        opacity,
        transform: [{ scale }],
      };
    }, [anchor, anchors, reducedMotion]);

    const animatedArtStyle = useAnimatedStyle(() => {
      if (reducedMotion) {
        return {};
      }
      const stride = anchors[1] || 300;
      const offset = scrollX.get() - anchor;
      const translateX = interpolate(
        offset,
        [-stride, 0, stride],
        [-14, 0, 14],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ translateX }, { scale: 1.06 }],
      };
    }, [anchor, anchors, reducedMotion]);

    const slideImage = isDark ? slide.darkImage : slide.lightImage;
    const accentColor = isDark ? slide.accent : slide.lightAccent;
    const cardBg = isDark ? '#07131A' : '#FFFFFF';
    const cardBorder = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(148, 163, 184, 0.28)';
    const tagBg = isDark ? 'rgba(8, 18, 28, 0.68)' : 'rgba(255, 255, 255, 0.9)';
    const tagBorder = isDark ? `${slide.accent}66` : `${slide.lightAccent}38`;
    const tagInk = isDark ? '#F8FAFC' : slide.lightAccent;
    const titleColor = isDark ? '#FFFFFF' : '#0F172A';
    const subColor = isDark ? 'rgba(241, 245, 249, 0.86)' : '#475569';
    const ctaBg = isDark ? `${slide.accent}24` : `${slide.lightAccent}14`;
    const ctaBorder = isDark ? `${slide.accent}70` : `${slide.lightAccent}36`;
    const ctaInk = isDark ? '#FFFFFF' : slide.lightAccent;

    return (
      <Animated.View style={[styles.cardFrame, { width: cardWidth }, animatedCardStyle]}>
        <Pressable
          onPress={() => onPress(slide.action)}
          accessibilityRole="button"
          accessibilityLabel={isUrdu ? slide.titleUr : slide.titleEn}
          style={({ pressed }) => [
            styles.cardPressable,
            { backgroundColor: cardBg, borderColor: cardBorder },
            pressed && styles.cardPressed,
          ]}>
          {/* Theme-matched parallax illustration artwork */}
          <Animated.View style={[StyleSheet.absoluteFill, animatedArtStyle]}>
            <Image
              source={slideImage}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
            />
          </Animated.View>

          {/* Original dark directional scrims for Dark Mode only; Light Mode uses bright negative space artwork directly */}
          {isDark ? (
            <>
              <View
                pointerEvents="none"
                style={[styles.leftScrimOuter, { backgroundColor: 'rgba(4, 10, 16, 0.28)' }]}
              />
              <View
                pointerEvents="none"
                style={[styles.leftScrimInner, { backgroundColor: 'rgba(4, 10, 16, 0.36)' }]}
              />
              <View
                pointerEvents="none"
                style={[styles.bottomScrim, { backgroundColor: 'rgba(4, 10, 16, 0.24)' }]}
              />
            </>
          ) : null}

          {/* Crisp overlay content kept cleanly bounded inside 174px height */}
          <View style={styles.cardOverlay}>
            <View style={styles.tagRow}>
              <View style={[styles.tagPill, { backgroundColor: tagBg, borderColor: tagBorder }]}>
                <Ionicons name={slide.icon} size={12} color={accentColor} />
                <Text
                  style={[styles.tagText, { color: tagInk }]}
                  maxFontSizeMultiplier={1.15}
                  numberOfLines={1}>
                  {isUrdu ? slide.tagUr : slide.tagEn}
                </Text>
              </View>
            </View>

            <View style={styles.copyBlock}>
              <Text
                style={[styles.cardTitle, { color: titleColor }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
                maxFontSizeMultiplier={1.15}>
                {isUrdu ? slide.titleUr : slide.titleEn}
              </Text>
              <Text
                style={[styles.cardSub, { color: subColor }]}
                numberOfLines={2}
                ellipsizeMode="tail"
                maxFontSizeMultiplier={1.15}>
                {isUrdu ? slide.subtitleUr : slide.subtitleEn}
              </Text>
            </View>

            <View style={styles.ctaRow}>
              <View style={[styles.ctaPill, { backgroundColor: ctaBg, borderColor: ctaBorder }]}>
                <Text
                  style={[styles.ctaText, { color: ctaInk }]}
                  maxFontSizeMultiplier={1.15}
                  numberOfLines={1}>
                  {isUrdu ? slide.ctaUr : slide.ctaEn}
                </Text>
                <Ionicons
                  name={isUrdu ? 'arrow-back' : 'arrow-forward'}
                  size={12}
                  color={accentColor}
                />
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

CarouselCard.displayName = 'CarouselCard';

interface IndicatorDotProps {
  index: number;
  accent: string;
  inactiveColor: string;
  isActive: boolean;
  isPaused: boolean;
  reducedMotion: boolean;
  scrollX: SharedValue<number>;
  anchorsSV: SharedValue<number[]>;
  isUrdu: boolean;
  onPress: (index: number) => void;
}

const PROGRESS_EASE = Easing.linear;

const IndicatorDot: React.FC<IndicatorDotProps> = React.memo(
  ({
    index,
    accent,
    inactiveColor,
    isActive,
    isPaused,
    reducedMotion,
    scrollX,
    anchorsSV,
    isUrdu,
    onPress,
  }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
      if (!isActive || isPaused || reducedMotion) {
        progress.set(0);
        return;
      }
      progress.set(0);
      progress.set(
        withTiming(1, {
          duration: AUTO_ADVANCE_DELAY_MS,
          easing: PROGRESS_EASE,
        })
      );
    }, [isActive, isPaused, reducedMotion, progress]);

    const focusOutput = useMemo(
      () => SLIDES.map((_, slideIdx) => (slideIdx === index ? 1 : 0)),
      [index]
    );

    const animatedDotStyle = useAnimatedStyle(() => {
      const currentAnchors = anchorsSV.get();
      const focus = interpolate(
        scrollX.get(),
        currentAnchors,
        focusOutput,
        Extrapolation.CLAMP
      );

      const width = interpolate(
        focus,
        [0, 1],
        [DOT_INACTIVE_WIDTH, DOT_ACTIVE_WIDTH],
        Extrapolation.CLAMP
      );
      const opacity = interpolate(focus, [0, 1], [0.55, 1], Extrapolation.CLAMP);
      const scaleY = reducedMotion
        ? 1
        : interpolate(focus, [0, 1], [0.92, 1.06], Extrapolation.CLAMP);
      const backgroundColor = interpolateColor(
        focus,
        [0, 1],
        [inactiveColor, accent]
      );

      return {
        width,
        opacity,
        backgroundColor,
        transform: [{ scaleY }],
      };
    }, [accent, focusOutput, inactiveColor, reducedMotion]);

    const animatedFillStyle = useAnimatedStyle(() => {
      const translateX = interpolate(
        progress.get(),
        [0, 1],
        [-DOT_ACTIVE_WIDTH, 0],
        Extrapolation.CLAMP
      );
      return {
        opacity: isActive && !reducedMotion && !isPaused ? 0.55 : 0,
        transform: [{ translateX }],
      };
    }, [isActive, isPaused, reducedMotion]);

    return (
      <Pressable
        onPress={() => onPress(index)}
        hitSlop={{ top: 12, bottom: 12, left: 6, right: 6 }}
        accessibilityRole="button"
        accessibilityLabel={`${isUrdu ? 'سلائیڈ' : 'Slide'} ${index + 1}`}>
        <Animated.View style={[styles.morphDot, animatedDotStyle]}>
          <Animated.View style={[styles.morphDotFill, animatedFillStyle]} />
        </Animated.View>
      </Pressable>
    );
  }
);

IndicatorDot.displayName = 'IndicatorDot';

interface FeatureCarouselProps {
  isDark: boolean;
  isUrdu: boolean;
  onSelectAction: (action: FeatureSlideAction) => void;
}

export const FeatureCarousel: React.FC<FeatureCarouselProps> = ({
  isDark,
  isUrdu,
  onSelectAction,
}) => {
  const theme = isDark ? Colors.dark : Colors.light;
  const reducedMotion = Boolean(useReducedMotion());
  const { width: windowWidth } = useWindowDimensions();

  const [measuredWidth, setMeasuredWidth] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const scrollRef = useRef<Animated.ScrollView>(null);
  const activeIndexRef = useRef<number>(0);
  const onSelectActionRef = useRef(onSelectAction);
  onSelectActionRef.current = onSelectAction;
  const scrollX = useSharedValue(0);

  const availableWidth = measuredWidth > 0 ? measuredWidth : Math.max(280, windowWidth - Spacing.lg * 2);
  const cardWidth = Math.round(availableWidth * 0.88);
  const stride = cardWidth + CARD_GAP;
  const scrollViewWidth = availableWidth + Spacing.lg * 2;
  const contentWidth = Spacing.lg * 2 + SLIDES.length * cardWidth + (SLIDES.length - 1) * CARD_GAP;
  const maxScrollX = Math.max(stride * 2 + 1, contentWidth - scrollViewWidth);

  const anchors = useMemo<[number, number, number, number]>(
    () => [0, stride, stride * 2, maxScrollX],
    [stride, maxScrollX]
  );
  const anchorsSV = useSharedValue<number[]>([0, stride, stride * 2, maxScrollX]);

  useEffect(() => {
    anchorsSV.set([0, stride, stride * 2, maxScrollX]);
  }, [stride, maxScrollX, anchorsSV]);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    if (nextWidth > 0 && Math.abs(nextWidth - measuredWidth) > 2) {
      setMeasuredWidth(nextWidth);
    }
  }, [measuredWidth]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.set(event.contentOffset.x);
    },
  });

  const scrollToSlide = useCallback(
    (targetIndex: number) => {
      const clamped = ((targetIndex % SLIDES.length) + SLIDES.length) % SLIDES.length;
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
      scrollRef.current?.scrollTo({
        x: anchors[clamped],
        y: 0,
        animated: !reducedMotion,
      });
    },
    [anchors, reducedMotion]
  );

  // Sync activeIndex cleanly once user manual drag finishes
  const syncIndexFromOffset = useCallback(
    (offsetX: number) => {
      let nearestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < anchors.length; i += 1) {
        const dist = Math.abs(offsetX - anchors[i]);
        if (dist < bestDist) {
          bestDist = dist;
          nearestIdx = i;
        }
      }
      if (nearestIdx !== activeIndexRef.current) {
        activeIndexRef.current = nearestIdx;
        setActiveIndex(nearestIdx);
      }
    },
    [anchors]
  );

  const handleScrollBeginDrag = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      syncIndexFromOffset(e.nativeEvent.contentOffset.x);
      setIsPaused(false);
    },
    [syncIndexFromOffset]
  );

  const handleScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const vx = Math.abs(e.nativeEvent.velocity?.x ?? 0);
      if (vx < 0.05) {
        syncIndexFromOffset(e.nativeEvent.contentOffset.x);
        setIsPaused(false);
      }
    },
    [syncIndexFromOffset]
  );

  // Automatic 2-second (2000ms) delay carousel advance
  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      const nextIndex = (activeIndexRef.current + 1) % SLIDES.length;
      scrollToSlide(nextIndex);
    }, AUTO_ADVANCE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, scrollToSlide]);

  const activeSlide = SLIDES[activeIndex] ?? SLIDES[0];

  const handlePressSlideAction = useCallback((action: FeatureSlideAction) => {
    onSelectActionRef.current(action);
  }, []);

  // Edge-to-edge swipable & auto-advancing Reanimated carousel
  return (
    <View style={styles.section} onLayout={handleContainerLayout}>
      {/* Header strip with section title + interactive dot pagination */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.liveDot,
              { backgroundColor: isDark ? activeSlide.accent : activeSlide.lightAccent },
            ]}
          />
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
            {isUrdu ? 'ایپ کی خصوصیات' : 'DISCOVER DIGISHOP'}
          </Text>
        </View>

        <View
          style={[
            styles.paginationTrack,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.07)',
            },
          ]}>
          {SLIDES.map((slide, idx) => (
            <IndicatorDot
              key={slide.id}
              index={idx}
              accent={isDark ? slide.accent : slide.lightAccent}
              inactiveColor={isDark ? '#475569' : '#CBD5E1'}
              isActive={activeIndex === idx}
              isPaused={isPaused}
              reducedMotion={reducedMotion}
              scrollX={scrollX}
              anchorsSV={anchorsSV}
              isUrdu={isUrdu}
              onPress={scrollToSlide}
            />
          ))}
        </View>
      </View>

      {/* Edge-to-edge swipable & auto-advancing Reanimated carousel */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToOffsets={anchors as unknown as number[]}
        snapToAlignment="start"
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.bleedScroll}
        contentContainerStyle={styles.scrollContent}>
        {SLIDES.map((slide, idx) => (
          <CarouselCard
            key={slide.id}
            slide={slide}
            index={idx}
            cardWidth={cardWidth}
            scrollX={scrollX}
            anchors={anchors}
            reducedMotion={reducedMotion}
            isDark={isDark}
            isUrdu={isUrdu}
            onPress={handlePressSlideAction}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 4,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  paginationTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    gap: DOT_GAP,
  },
  morphDot: {
    height: DOT_HEIGHT,
    borderRadius: DOT_HEIGHT / 2,
    overflow: 'hidden',
  },
  morphDotFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    borderRadius: DOT_HEIGHT / 2,
  },
  bleedScroll: {
    marginHorizontal: -Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: CARD_GAP,
    paddingVertical: 2,
  },
  cardFrame: {
    height: CARD_HEIGHT,
  },
  cardPressable: {
    flex: 1,
    borderRadius: 22,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  leftScrimOuter: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    left: -20,
    width: '78%',
    borderTopRightRadius: 150,
    borderBottomRightRadius: 150,
  },
  leftScrimInner: {
    position: 'absolute',
    top: -10,
    bottom: -10,
    left: -10,
    width: '62%',
    borderTopRightRadius: 120,
    borderBottomRightRadius: 120,
  },
  bottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '44%',
  },
  cardOverlay: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    justifyContent: 'space-between',
    maxWidth: '68%',
    overflow: 'hidden',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  copyBlock: {
    gap: 3,
    flexShrink: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  cardSub: {
    fontSize: 11.5,
    fontWeight: '500',
    lineHeight: 15.5,
    flexShrink: 1,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
  },
  ctaText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
