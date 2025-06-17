import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { ListingSource } from '@/services/dataAggregation';

interface SourceBadgeProps {
  source?: string;
}

export function SourceBadge({ source }: SourceBadgeProps) {
  if (!source || source === ListingSource.INTERNAL) {
    return null;
  }
  
  const getSourceColor = () => {
    switch (source) {
      case ListingSource.MOBILE_DE:
        return '#FF9900';
      case ListingSource.KLEINANZEIGEN:
        return '#86B817';
      default:
        return Colors.secondaryText;
    }
  };
  
  const getSourceName = () => {
    switch (source) {
      case ListingSource.MOBILE_DE:
        return 'mobile.de';
      case ListingSource.KLEINANZEIGEN:
        return 'kleinanzeigen.de';
      default:
        return source;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getSourceColor() }]}>
      <Text style={styles.text}>{getSourceName()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});