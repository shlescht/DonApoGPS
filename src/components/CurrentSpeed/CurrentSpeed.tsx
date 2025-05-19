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
          const speedMps = position.coords.speed ?? 0;
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
      <Text style={styles.mainSpeedLable}>km/h</Text>

      <View style={styles.statsLabels}>
        <Text style={styles.label}>MAX</Text>
        <Text style={styles.label}>AVG</Text>
      </View>

      <View style={styles.statsValues}>
        <Text style={styles.stat}>{maxSpeed.toString()}</Text>
        <Text style={styles.stat}>{averageSpeed.toString()}</Text>
      </View>

      <View style={styles.statsValues}>
        <Text style={styles.stat}>km/h</Text>
        <Text style={styles.stat}>km/h</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },

  mainSpeed: {
    fontSize: 200,
    color: '#00ffff', // Cian neón
    fontWeight: 'bold',
    textShadowColor: '#0ff', // Glow neón
    textShadowRadius: 20,
  },

  mainSpeedLable: {
    fontSize: 120,
    color: '#00ffff', // Cian neón
    fontWeight: 'bold',
    textShadowColor: '#0ff', // Glow neón
    textShadowRadius: 20,
    marginBottom: 40,
  },

  statsLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },

  statsValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },

  label: {
    fontSize: 24,
    color: '#ff00ff', // Fucsia neón
    fontWeight: 'bold',
    textShadowColor: '#f0f',
    textShadowRadius: 10,
  },

  stat: {
    fontSize: 40,
    color: '#00ff00', // Verde neón
    fontWeight: 'bold',
    textShadowColor: '#0f0',
    textShadowRadius: 15,
    borderWidth: 1,
  },
});
