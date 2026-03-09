import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

export function useGeolocation() {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = position.coords;

      // Try to get a readable address
      try {
        const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (address) {
          const parts = [address.street, address.city, address.region].filter(Boolean);
          if (parts.length > 0) {
            setLocation(parts.join(', '));
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fall through to coordinates
      }

      setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    } catch (err) {
      setError('Unable to retrieve location');
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, loading, error, getLocation, setLocation };
}
