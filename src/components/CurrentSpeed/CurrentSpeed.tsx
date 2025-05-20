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
import Ionicons from 'react-native-vector-icons/Ionicons';

const COLORS = {
  neonCyan: '#00ffff',
  neonMagenta: '#ff00ff',
  neonGreen: '#00ff00',
};

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
      <Text style={styles.mainSpeedLable}>Km/h</Text>

      <View style={styles.statsContainer}>
        <View style={styles.metricBlock}>
          <Text style={styles.label}>Max</Text>
          <Ionicons name="speedometer" size={60} color={COLORS.neonMagenta} />
          <Text style={styles.stat}>{maxSpeed}</Text>
          <Text style={styles.unit}>Km/h</Text>
        </View>

        <View style={styles.metricBlock}>
          <Text style={styles.label}>Avg</Text>
          <Ionicons name="analytics" size={60} color={COLORS.neonMagenta} />
          <Text style={styles.stat}>{averageSpeed}</Text>
          <Text style={styles.unit}>Km/h</Text>
        </View>
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
    color: COLORS.neonCyan,
    textShadowColor: '#0ff', // Glow neón
    textShadowRadius: 20,
    fontFamily: 'Audiowide',
  },

  mainSpeedLable: {
    fontSize: 120,
    color: COLORS.neonCyan,
    textShadowColor: '#0ff', // Glow neón
    textShadowRadius: 20,
    marginBottom: 40,
    fontFamily: 'Audiowide',
  },

  statsContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  metricBlock: {
    flex: 1,
    alignItems: 'center',
  },

  label: {
    fontSize: 24,
    color: COLORS.neonMagenta,
    textShadowColor: '#f0f',
    textShadowRadius: 10,
    marginBottom: 4,
    fontFamily: 'VT323',
  },

  stat: {
    fontSize: 80,
    color: COLORS.neonGreen,
    textShadowColor: '#0f0',
    textShadowRadius: 15,
    marginVertical: 4,
    fontFamily: 'VT323',
  },

  unit: {
    fontSize: 24,
    color: COLORS.neonCyan,
    marginTop: 4,
    textShadowColor: '#0ff', // Glow neón
    textShadowRadius: 20,
    fontFamily: 'Audiowide',
  },
});
