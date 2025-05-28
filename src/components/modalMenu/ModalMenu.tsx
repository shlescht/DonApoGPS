import {Button, Modal, Text, View} from 'react-native';

interface MenuModalProps {
  onClose: () => void;
  visible: boolean;
}
export const ModalMenu = ({onClose, visible}: MenuModalProps) => {
  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="fade">
      <View>
        <Button onPress={() => onClose()} title="Cerrar" />
        <Text>Modal</Text>
      </View>
    </Modal>
  );
};
