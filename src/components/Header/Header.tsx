import {StyleSheet, Text} from 'react-native';

export const Header = () => {
  return <Text style={styles.text}>DonApoGPS</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
});
