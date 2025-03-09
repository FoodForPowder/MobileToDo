import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { Group } from '../models/Group.interface';

interface EditGroupModalProps {
  visible: boolean;
  group?: Group;
  onClose: () => void;
  onSave: (group: Partial<Group>) => void;
}

export const EditGroupModal = ({
  visible,
  group,
  onClose,
  onSave,
}: EditGroupModalProps) => {
  const [title, setTitle] = useState(group?.title || '');

  useEffect(() => {
    setTitle(group?.title || '');
  }, [group]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      id: group?.id,
      title: title.trim(),
      lists: group?.lists || [],
    });
    
    setTitle('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {group ? 'Редактировать группу' : 'Создать группу'}
          </Text>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Название группы"
            autoFocus
          />

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Отмена</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                Сохранить
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6E0EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#6750A4',
  },
  buttonText: {
    fontSize: 16,
  },
  saveButtonText: {
    color: 'white',
  },
});