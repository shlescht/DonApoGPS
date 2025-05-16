import Geolocation from '@react-native-community/geolocation';
import KeepAwake from '@sayem314/react-native-keep-awake';
import {useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const CurrentSpeed = () => {
  const [mainSpeed, setMainSpeed] = useState<number>(0);
  const [maxSpeed, setMaxSpeed] = useState<number>(0);
  const [averageSpeed, setAverageSpeed] = useState<number>(0);
  const maxSpeedRef = useRef<number>(0);
  const speedHistory = useRef<number[]>([]);

  useEffect(() => {
    let watchID: number;
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de ubicación',
            message:
              'DonApoGPS necesita acceder a tu ubicación para calcular velocidad',
            buttonNeutral: 'Preguntar luego',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    };

    const startWatching = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      }
      watchID = Geolocation.watchPosition(
        position => {
          const speedMps = position.coords.speed ?? 0; // m/s
          const speedKmh = speedMps * 3.6;
          const roundedSpeed = Number(speedKmh.toFixed(0));
          setMainSpeed(roundedSpeed);
          speedHistory.current.push(roundedSpeed);
           if (roundedSpeed > maxSpeedRef.current) {
             maxSpeedRef.current = roundedSpeed;
             setMaxSpeed(roundedSpeed);
           }
          const sum = speedHistory.current.reduce((acc, s) => acc + s, 0);
          const avg = sum / speedHistory.current.length;
          setAverageSpeed(Number(avg.toFixed(0)));
        },
        error => console.warn(error.message),
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 1000,
          fastestInterval: 500,
        },
      );
    };

    startWatching();

    return () => {
      Geolocation.clearWatch(watchID);
      setMainSpeed(0);
      setMaxSpeed(0);
      setAverageSpeed(0);
    };
  }, []);
  return (
    <View style={styles.container}>
      <KeepAwake />
      <Text style={styles.mainSpeed}>{mainSpeed.toString()}</Text>
      <View style={styles.stats}>
        <Text style={styles.maxSpeedLabel}>Max</Text>
        <Text style={styles.averageSpeedLable}>Avg</Text>
      </View>
      <View style={styles.stats}>
        <Text style={styles.maxSpeed}>{maxSpeed.toString()}</Text>
        <Text style={styles.averageSpeed}>{averageSpeed.toString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
  },
  mainSpeed: {
    color: 'white',
    fontSize: 240,
  },
  maxSpeed: {
    fontSize: 100,
    color: 'white',
    flex: 1,
  },
  averageSpeed: {
    fontSize: 100,
    color: 'white',
    flex: 1,
  },
  maxSpeedLabel: {
    fontSize: 70,
    color: 'white',
    flex: 1,
  },
  averageSpeedLable: {
    fontSize: 70,
    color: 'white',
    flex: 1,
  },
});
