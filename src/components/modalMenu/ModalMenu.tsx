import {Button, Modal, StyleSheet, Text, View} from 'react-native';

interface MenuModalProps {
  onClose: () => void;
  visible: boolean;
}
export const ModalMenu = ({onClose, visible}: MenuModalProps) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          <Button onPress={() => onClose()} title="Cerrar" />
          <Text style={styles.titleText}>Mapa</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d011f',
  },
  content: {
    // width: '75%',
  },
  titleText: {
    fontSize: 120,
    color: '#00ffff',
    textShadowColor: '#0ff', // Glow neón
    textShadowRadius: 20,
    marginBottom: 40,
    fontFamily: 'Audiowide',
  },
});
