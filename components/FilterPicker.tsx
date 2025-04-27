import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useState } from 'react';

interface FilterPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectFilter: (filter: string) => void;
}

const filters = [
  { name: 'Normal', value: 'none' },
  { name: 'Grayscale', value: 'grayscale' },
  { name: 'Sepia', value: 'sepia' },
  { name: 'Bright', value: 'bright' },
];

export default function FilterPicker({ isVisible, onClose, onSelectFilter }: FilterPickerProps) {
  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choose a Filter</Text>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={styles.filterButton}
              onPress={() => {
                onSelectFilter(filter.value);
                onClose();
              }}
            >
              <Text style={styles.filterText}>{filter.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#25292e',
  },
  filterButton: {
    padding: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  filterText: {
    fontSize: 16,
    color: '#25292e',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
  },
  closeText: {
    fontSize: 16,
    color: '#ff4444',
  },
});