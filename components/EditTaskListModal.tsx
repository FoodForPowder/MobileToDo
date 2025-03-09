'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { TaskList } from '../models/TaskList.interface';
import { Group } from '../models/Group.interface';

// Добавляем константы для цветов
const COLORS = {
  primary: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
  ],
  background: [
    '#FFF5F5', '#F0FFF4', '#EBFBFF', '#F3F0FF',
    '#FFF0F6', '#FFFBEB', '#F0F9FF', '#F6F5FF',
  ],
};

// Добавляем константу с эмодзи
const EMOJI_ICONS = [
  '🎮', '📚', '🎵', '🎨', '⚽', '🎬', '✈️', '🏃‍♂️',
  '🍳', '💪', '🎸', '📷', '🏊‍♂️', '🎯', '🚴‍♂️', '🎪',
];


interface EditTaskListModalProps {
  visible: boolean
  taskList?: TaskList
  groups: Group[]
  currentGroupId?: string
  onSelectGroup: (groupId: string) => void
  onClose: () => void
  onSave: (taskList: TaskList) => void
}

export const EditTaskListModal = ({
  visible,
  taskList,
  groups,
  currentGroupId,
  onSelectGroup,
  onClose,
  onSave,
}: EditTaskListModalProps) => {
  const [title, setTitle] = useState(taskList?.title || '');
  const [activeTab, setActiveTab] = useState('main');
  const [selectedColor, setSelectedColor] = useState(taskList?.color || COLORS.primary[0]);
  const [selectedBackground, setSelectedBackground] = useState(taskList?.backgroundColor || COLORS.background[0]);
  const [selectedIcon, setSelectedIcon] = useState(taskList?.icon || EMOJI_ICONS[0]);

  useEffect(() => {
    setTitle(taskList?.title || '');
    setSelectedColor(taskList?.color || COLORS.primary[0]);
    setSelectedBackground(taskList?.backgroundColor || COLORS.background[0]);
    setSelectedIcon(taskList?.icon || EMOJI_ICONS[0]);
  }, [taskList]);

  const handleSave = () => {
    if (!title.trim()) {return;}

    onSave({
      id: taskList?.id,
      title: title.trim(),
      count: taskList?.count || 0,
      color: selectedColor,
      backgroundColor: selectedBackground,
      icon: selectedIcon,
    });
  };

  const renderMainTab = () => (
    <>
      <View style={styles.iconSelector}>
        <Text style={styles.sectionTitle}>Иконка списка</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedIcon}
            onValueChange={setSelectedIcon}
            style={styles.iconPicker}
          >
            {EMOJI_ICONS.map((emoji, index) => (
              <Picker.Item
                key={index}
                label={`${emoji}`}
                value={emoji}
              />
            ))}
          </Picker>
        </View>
      </View>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Название списка"
      />

      <Picker
        selectedValue={currentGroupId}
        onValueChange={onSelectGroup}
        style={styles.picker}
      >
        {groups.map(group => (
          <Picker.Item key={group.id} label={group.title} value={group.id} />
        ))}
      </Picker>
    </>
  );

  const renderColorsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Основной цвет</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorsContainer}>
        {COLORS.primary.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorItem,
              { backgroundColor: color },
              selectedColor === color && styles.selectedItem,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Цвет фона</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorsContainer}>
        {COLORS.background.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorItem,
              { backgroundColor: color },
              selectedBackground === color && styles.selectedItem,
            ]}
            onPress={() => setSelectedBackground(color)}
          />
        ))}
      </ScrollView>
    </ScrollView>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {taskList ? 'Редактировать список' : 'Создать список'}
          </Text>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'main' && styles.activeTab]}
              onPress={() => setActiveTab('main')}
            >
              <Text style={[styles.tabText, activeTab === 'main' && styles.activeTabText]}>
                Основное
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'colors' && styles.activeTab]}
              onPress={() => setActiveTab('colors')}
            >
              <Text style={[styles.tabText, activeTab === 'colors' && styles.activeTabText]}>
                Оформление
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContent}>
            {activeTab === 'main' && renderMainTab()}
            {activeTab === 'colors' && renderColorsTab()}
          </View>

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
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#6750A4',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  saveButtonText: {
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E0EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6750A4',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#6750A4',
    fontWeight: 'bold',
  },
  tabContent: {
    minHeight: 120,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 12,
    color: '#666',
  },
  colorsContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#6750A4',
  },
  iconSelector: {
    marginBottom: 20,
  },
  emojiContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  emojiItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  emojiText: {
    fontSize: 24,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E6E0EB',
    borderRadius: 8,
    marginTop: 8,
  },
  iconPicker: {
    height: 50,
    width: '100%',
  },
});

