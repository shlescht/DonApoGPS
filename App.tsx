import React from 'react';
import {StyleSheet, View} from 'react-native';
import {CurrentSpeed, Header} from './src/components';

function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Header />
      <CurrentSpeed />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingLeft: 10,
    backgroundColor: 'black',
    flex: 1,
  },
});

export default App;
