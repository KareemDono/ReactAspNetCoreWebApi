import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const PopupMessage = ({ visible, message, type, onClose }) => {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={() => {}}>
      <View style={styles.modalContainer}>
        <View style={[styles.cardContainer, type === 'success' ? styles.successCard : styles.errorCard]}>
          <Text style={styles.messageText}>{message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cardContainer: {
    padding: 20,
    borderRadius: 8,
    width: '80%',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: '#4caf50',
  },
  errorCard: {
    backgroundColor: '#f44336',
  },
  messageText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#2196f3',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PopupMessage;
