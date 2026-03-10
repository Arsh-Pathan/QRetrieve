import React from 'react';
import { StyleSheet } from 'react-native';
import MapViewRN, { Marker } from 'react-native-maps';
import { radius } from '../constants/theme';

interface MapViewProps {
  lat: number;
  lng: number;
  label?: string;
}

export function MapView({ lat, lng, label = 'Found here' }: MapViewProps) {
  return (
    <MapViewRN
      style={styles.map}
      initialRegion={{
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker coordinate={{ latitude: lat, longitude: lng }} title={label} />
    </MapViewRN>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', height: 250, borderRadius: radius.md },
});
