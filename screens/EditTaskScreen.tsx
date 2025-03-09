'use client';

import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { Icon } from '../components/Icons';
import DatePicker from 'react-native-date-picker';
import type { Task, TaskPriority } from '../models/Task.interface';

interface EditTaskScreenProps {
  route: {
    params: {
      task?: Task
      listId: string
      groupId: string
      listTitle: string
      isEditing: boolean
      onTaskUpdate?: (task: Task) => void
      onTaskDelete?: (taskId: string) => void
    }
  }
  navigation: any
}

export default function EditTaskScreen({ route, navigation }: EditTaskScreenProps) {
  const { task, listId, groupId, listTitle, isEditing } = route.params;

  const [title, setTitle] = useState(task?.title || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'Нейтрально');
  const [starred, setStarred] = useState(task?.starred || false);
  const [notes, setNotes] = useState(task?.notes || '');

  // Состояния для дат
  const [reminderDate, setReminderDate] = useState<Date | null>(task?.reminderDate ? new Date(task.reminderDate) : null);
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(task?.deadlineDate ? new Date(task.deadlineDate) : null);

  // Состояния для модальных окон с календарем
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [completed, setCompleted] = useState(task?.completed || false);

  // Форматирование даты для отображения
  const formatDate = (date: Date | null): string => {
    if (!date) {return '';}
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Обновляем обработчик сохранения
  const handleSaveTask = () => {
    if (!title.trim()) {
      return;
    }

    const updatedTask: Task = {
      id: task?.id || Date.now().toString(),
      title: title.trim(),
      completed,
      priority,
      starred,
      listId,
      groupId,
      notes: notes,
      reminderDate: reminderDate ? reminderDate.toISOString() : undefined,
      deadlineDate: deadlineDate ? deadlineDate.toISOString() : undefined,
    };

    // Вызываем callback с обновленной задачей
    if (route.params.onTaskUpdate) {
      route.params.onTaskUpdate(updatedTask);
    }

    // Возвращаемся назад
    navigation.goBack();
  };

  // Обновляем обработчик удаления
  const handleDeleteTask = () => {
    if (task?.id && route.params.onTaskDelete) {
      route.params.onTaskDelete(task.id);
    }
    navigation.goBack();
  };

  // Получение цвета для приоритета
  const getPriorityColor = (priorityType: TaskPriority) => {
    switch (priorityType) {
      case 'Важно':
        return '#FF4D4F';
      case 'Неважно':
        return '#52C41A';
      case 'Нейтрально':
        return '#FAAD14';
      default:
        return '#FAAD14';
    }
  };

  // JSX для кнопки приоритета
  const renderPriorityButton = () => (
    <TouchableOpacity
      style={[styles.priorityButton, { backgroundColor: getPriorityColor(priority) }]}
      onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
    >
      <Text style={styles.priorityButtonText}>{priority}</Text>
      <Icon name="fa-caret-down" size={16} color="white" />
    </TouchableOpacity>
  );

  // JSX для выпадающего списка приоритетов
  const renderPriorityDropdown = () => (
    <View style={styles.priorityDropdown}>
      <TouchableOpacity
        style={[styles.priorityOption, { backgroundColor: getPriorityColor('Важно') }]}
        onPress={() => {
          setPriority('Важно');
          setShowPriorityDropdown(false);
        }}
      >
        <Text style={styles.priorityOptionText}>Важно</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.priorityOption, { backgroundColor: getPriorityColor('Нейтрально') }]}
        onPress={() => {
          setPriority('Нейтрально');
          setShowPriorityDropdown(false);
        }}
      >
        <Text style={styles.priorityOptionText}>Нейтрально</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.priorityOption, { backgroundColor: getPriorityColor('Неважно') }]}
        onPress={() => {
          setPriority('Неважно');
          setShowPriorityDropdown(false);
        }}
      >
        <Text style={styles.priorityOptionText}>Неважно</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setShowPriorityDropdown(false);
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{listTitle}</Text>
            {isEditing && (
              <TouchableOpacity onPress={handleDeleteTask} style={styles.deleteButton}>
                <Icon name="trash" size={24} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.taskNameSection}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity style={styles.checkbox} onPress={() => setCompleted(!completed)}>
                  <Icon name={completed ? 'check-square' : 'square'} size={20} color={completed ? '#6750A4' : '#666'} />
                </TouchableOpacity>
              </View>

              <View style={styles.taskNameContainer}>
                <Text style={styles.inputLabel}>Task name</Text>
                <TextInput
                  style={styles.taskNameInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Task name"
                  placeholderTextColor="#999"
                  autoFocus={!isEditing}
                />
                {title.length > 0 && (
                  <TouchableOpacity style={styles.clearButton} onPress={() => setTitle('')}>
                    <Icon name="close-circle" size={20} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.taskProps}>
              <View style={styles.priorityContainer}>
                {renderPriorityButton()}
                {showPriorityDropdown && renderPriorityDropdown()}
              </View>

              <TouchableOpacity onPress={() => setStarred(!starred)} style={styles.starButton}>
                <Icon name="star" size={24} color={starred ? '#FAAD14' : '#D9D9D9'} />
              </TouchableOpacity>
            </View>

            {/* Секция напоминания с календарем */}
            <View style={styles.dateSection}>
              <Text style={styles.sectionTitle}>Напомнить</Text>
              <TouchableOpacity style={styles.dateInputContainer} onPress={() => setShowReminderPicker(true)}>
                <Text style={[styles.dateInput, !reminderDate && styles.dateInputPlaceholder]}>
                  {reminderDate ? formatDate(reminderDate) : 'Выберите дату и время'}
                </Text>
                <Icon name="calendar" size={20} color="#6750A4" />
              </TouchableOpacity>
              {reminderDate && (
                <TouchableOpacity style={styles.clearDateButton} onPress={() => setReminderDate(null)}>
                  <Text style={styles.clearDateText}>Очистить</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Секция дедлайна с календарем */}
            <View style={styles.dateSection}>
              <Text style={styles.sectionTitle}>Дедлайн</Text>
              <TouchableOpacity style={styles.dateInputContainer} onPress={() => setShowDeadlinePicker(true)}>
                <Text style={[styles.dateInput, !deadlineDate && styles.dateInputPlaceholder]}>
                  {deadlineDate ? formatDate(deadlineDate) : 'Выберите дату и время'}
                </Text>
                <Icon name="calendar" size={20} color="#6750A4" />
              </TouchableOpacity>
              {deadlineDate && (
                <TouchableOpacity style={styles.clearDateButton} onPress={() => setDeadlineDate(null)}>
                  <Text style={styles.clearDateText}>Очистить</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.repeatSection}>
              <View style={styles.repeatLeft}>
                <Icon name="repeat" size={24} color="#666" />
                <Text style={styles.repeatText}>Повторять</Text>
              </View>
              <Icon name="arrow-forward-ios" size={16} color="#666" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.notesSection}>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Напишите что-нибудь"
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSaveTask}>
              <Icon name="success" size={24} color="#6750A4" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack()}>
              <Icon name="close" size={24} color="#6750A4" />
            </TouchableOpacity>
          </View>

          {/* Модальное окно с календарем для напоминания */}
          <Modal visible={showReminderPicker} transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Выберите дату напоминания</Text>
                <DatePicker
                  date={reminderDate || new Date()}
                  onDateChange={(date) => setReminderDate(date)}
                  mode="datetime"
                  locale="ru"
                  androidVariant="nativeAndroid"
                  textColor="#000"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowReminderPicker(false)}
                  >
                    <Text style={styles.cancelButtonText}>Отмена</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => setShowReminderPicker(false)}
                  >
                    <Text style={styles.confirmButtonText}>Подтвердить</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Модальное окно с календарем для дедлайна */}
          <Modal visible={showDeadlinePicker} transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Выберите дату дедлайна</Text>
                <DatePicker
                  date={deadlineDate || new Date()}
                  onDateChange={(date) => setDeadlineDate(date)}
                  mode="datetime"
                  locale="ru"
                  androidVariant="nativeAndroid"
                  textColor="#000"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowDeadlinePicker(false)}
                  >
                    <Text style={styles.cancelButtonText}>Отмена</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => setShowDeadlinePicker(false)}
                  >
                    <Text style={styles.confirmButtonText}>Подтвердить</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E0EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  taskNameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  checkboxContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskNameContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F2EEFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
  },
  taskNameInput: {
    fontSize: 16,
    paddingVertical: 4,
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: '50%',
    marginTop: -10,
  },
  taskProps: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  priorityContainer: {
    position: 'relative',
    width:125,
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  priorityButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  priorityDropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  priorityOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginVertical: 4,
  },
  priorityOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  starButton: {
    padding: 8,
  },
  dateSection: {
    backgroundColor: '#F2EEFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#6750A4',
    paddingVertical: 8,
  },
  dateInput: {
    fontSize: 16,
    flex: 1,
    color: '#000',
  },
  dateInputPlaceholder: {
    color: '#999',
  },
  clearDateButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  clearDateText: {
    color: '#6750A4',
    fontSize: 14,
  },
  repeatSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  repeatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repeatText: {
    fontSize: 16,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E0EB',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  notesSection: {
    backgroundColor: '#F2EEFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    minHeight: 200,
  },
  notesInput: {
    fontSize: 16,
    height: 180,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F2EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  // Стили для модального окна с календарем
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    alignItems: 'center',
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
    color: '#6750A4',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#6750A4',
  },
  cancelButtonText: {
    color: '#6750A4',
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

