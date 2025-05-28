import {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {ModalMenu} from '../modalMenu/ModalMenu';

export const Header = () => {
  const [icon, setIcon] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const handleMenuPress = () => {
    console.log('Abrir menú o mapa próximamente');
    setIcon(!icon);
    handleModalClose();
  };
  const handleModalClose = () => {
    setVisible(!visible);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        <Feather name={icon ? 'minimize-2' : 'menu'} size={28} color="#0ff" />
      </TouchableOpacity>
      <Text style={styles.title}>DonApoGPS</Text>
      <ModalMenu onClose={handleModalClose} visible={visible} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: 'black',
  },
  menuButton: {
    marginRight: 16,
  },
  title: {
    color: '#00ffff',
    fontSize: 28,
    textShadowColor: '#0ff',
    textShadowRadius: 10,
    fontFamily: 'Audiowide',
  },
});
