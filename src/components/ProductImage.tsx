import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  StyleSheet,
  StyleProp,
  ImageStyle,
  ViewStyle,
  ImageResizeMode,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { resolveDriveImageUrl } from '@/services/googleDriveService';
import { catalogPalette } from '@/components/CatalogIcon';

interface ProductImageProps {
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  resizeMode?: ImageResizeMode;
  fallbackIcon?: React.ReactNode;
  fallbackSize?: number;
  fallbackColor?: string;
  /** MaterialCommunityIcons glyph shown (on a tinted tile) when there is no photo. */
  iconName?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  uri,
  style,
  containerStyle,
  resizeMode = 'cover',
  fallbackIcon,
  fallbackSize = 32,
  fallbackColor = '#94a3b8',
  iconName,
}) => {
  const [resolvedUri, setResolvedUri] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (!uri) {
      setResolvedUri(null);
      setHasError(false);
      return;
    }

    setHasError(false);

    // If already local data/blob, use directly
    if (uri.startsWith('data:') || uri.startsWith('blob:') || uri.startsWith('file://')) {
      setResolvedUri(uri);
      return;
    }

    // Resolve Drive URL
    setIsLoading(true);
    resolveDriveImageUrl(uri)
      .then((resolved) => {
        if (!isCancelled) {
          setResolvedUri(resolved || null);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [uri]);

  if (!resolvedUri || hasError) {
    if (!fallbackIcon && iconName) {
      const p = catalogPalette(iconName);
      return (
        <View style={[styles.fallbackContainer, { backgroundColor: p.bg }, containerStyle]}>
          <MaterialCommunityIcons
            name={iconName as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
            size={fallbackSize + 10}
            color={p.fg}
          />
        </View>
      );
    }
    return (
      <View style={[styles.fallbackContainer, containerStyle]}>
        {fallbackIcon || (
          <Ionicons name="cube-outline" size={fallbackSize} color={fallbackColor} />
        )}
      </View>
    );
  }

  return (
    <Image
      source={{ uri: resolvedUri }}
      style={style}
      resizeMode={resizeMode}
      onError={() => {
        setHasError(true);
      }}
    />
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
