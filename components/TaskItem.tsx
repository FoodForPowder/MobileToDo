import type React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from './Icons';
import type { Task } from '../models/Task.interface';

interface TaskItemProps {
  task: Task
  onToggleComplete: (taskId: string) => void
  onToggleStar: (taskId: string) => void
  onPress?: (task: Task) => void
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onToggleStar, onPress }) => {
  // Функция для отображения цвета приоритета
  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  return (
    <View style={styles.taskItem}>
      <TouchableOpacity style={styles.checkbox} onPress={() => onToggleComplete(task.id)}>
        <Icon name={task.completed ? 'check-square' : 'square'} size={20} color={task.completed ? '#6750A4' : '#666'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPress && onPress(task)} style={styles.taskTitleContainer}>
        <Text style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>{task.title}</Text>
      </TouchableOpacity>

      <View style={styles.taskActions}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
          <Text style={styles.priorityText}>{task.priority}</Text>
        </View>

        <TouchableOpacity style={styles.starButton} onPress={() => onToggleStar(task.id)}>
          <Icon name="star" size={24} color={task.starred ? '#FAAD14' : '#D9D9D9'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskTitleContainer: {
    flex: 1,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  starButton: {
    padding: 4,
  },
});

