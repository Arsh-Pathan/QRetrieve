import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapViewRN, { Marker } from 'react-native-maps';
import { radius, colors, shadows } from '../constants/theme';

interface MapViewProps {
  lat: number;
  lng: number;
  label?: string;
}

export function MapView({ lat, lng, label = 'Found here' }: MapViewProps) {
  return (
    <View style={styles.container}>
      <MapViewRN
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        <Marker 
          coordinate={{ latitude: lat, longitude: lng }} 
          title={label}
          pinColor={colors.primary}
        />
      </MapViewRN>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  map: { width: '100%', height: '100%' },
});
