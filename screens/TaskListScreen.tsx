'use client';

import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Icon } from '../components/Icons';
import { TaskItem } from '../components/TaskItem';
import type { Task } from '../models/Task.interface';
import { EditTaskListModal } from '../components/EditTaskListModal';

// Мок-данные для задач
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Сходить на тренировку',
    completed: false,
    priority: 'Неважно',
    starred: false,
    listId: '1-1',
    groupId: '1',
  },
  {
    id: '2',
    title: 'Сходить на тренировку',
    completed: false,
    priority: 'Неважно',
    starred: false,
    listId: '1-1',
    groupId: '1',
  },
  {
    id: '3',
    title: 'Сходить на тренировку',
    completed: false,
    priority: 'Неважно',
    starred: false,
    listId: '1-1',
    groupId: '1',
  },
  {
    id: '4',
    title: 'Сходить на тренировку',
    completed: false,
    priority: 'Неважно',
    starred: false,
    listId: '1-1',
    groupId: '1',
  },
  {
    id: '5',
    title: 'Поменять перчатки',
    completed: false,
    priority: 'Важно',
    starred: false,
    listId: '1-1',
    groupId: '1',
  },
  {
    id: '6',
    title: 'Изучить новые упражнения',
    completed: false,
    priority: 'Нейтрально',
    starred: false,
    listId: '1-1',
    groupId: '1',
  },
  {
    id: '7',
    title: 'Изучить новые упражнения для пресса',
    completed: true,
    priority: 'Нейтрально',
    starred: false,
    listId: '1-1',
    groupId: '1',
  },
  {
    id: '8',
    title: 'Изучить новые упражнения для спины',
    completed: true,
    priority: 'Нейтрально',
    starred: false,
    listId: '1-1',
    groupId: '1',
  },
  {
    id: '9',
    title: 'Изучить новые упражнения для ног',
    completed: true,
    priority: 'Нейтрально',
    starred: false,
    listId: '1-1',
    groupId: '1',
  },
  {
    id: '10',
    title: 'Изучить новые упражнения для рук',
    completed: true,
    priority: 'Нейтрально',
    starred: false,
    listId: '1-1',
    groupId: '1',
  },
];

interface TaskListScreenProps {
  route: {
    params: {
      listId: string;
      groupId: string;
      listTitle: string;
      listIcon?: string;
      listColor?: string;
      backgroundColor?: string;
      updatedTask?: Task;
      deletedTaskId?: string;
    };
  };
  navigation: any;
}

export default function TaskListScreen({ route, navigation }: TaskListScreenProps) {
  const { listId, groupId, listTitle, updatedTask, deletedTaskId } = route.params;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortMenuVisible, setFilterMenuVisible] = useState(false);
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);
  const [filterType, setFilterType] = useState<'Важность' | 'Приоритет' | 'Срочность'>('Важность');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentList, setCurrentList] = useState({
    id: listId,
    title: listTitle,
    icon: route.params.listIcon,
    color: route.params.listColor,
    backgroundColor: route.params.backgroundColor
  });

  // Загрузка задач при монтировании компонента
  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API или базе данных
    // Фильтруем задачи по listId и groupId
    const filteredTasks = MOCK_TASKS.filter((task) => task.listId === listId && task.groupId === groupId);
    setTasks(filteredTasks);
  }, [listId, groupId]);

  // Обработка обновленной или удаленной задачи
  useEffect(() => {
    if (updatedTask) {
      setTasks((prevTasks) => {
        const taskExists = prevTasks.some((task) => task.id === updatedTask.id);
        if (taskExists) {
          // Обновляем существующую задачу
          return prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
        } else {
          // Добавляем новую задачу
          return [...prevTasks, updatedTask];
        }
      });
    }

    if (deletedTaskId) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deletedTaskId));
    }
  }, [updatedTask, deletedTaskId]);

  // Функция для переключения статуса выполнения задачи
  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    );
  };

  // Функция для переключения статуса "избранное" задачи
  const toggleTaskStarred = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, starred: !task.starred } : task)));
  };

  // Функция для редактирования задачи
  const handleEditTask = (task?: Task) => {
    navigation.navigate('EditTask', {
      task,
      listId,
      groupId,
      listTitle,
      isEditing: !!task,
      onTaskUpdate: (updatedTask: Task) => {
        // Обновляем состояние задач
        setTasks(prevTasks => {
          if (updatedTask.id) {
            return prevTasks.map(t =>
              t.id === updatedTask.id ? updatedTask : t
            );
          } else {
            return [...prevTasks, updatedTask];
          }
        });
      },
      onTaskDelete: (taskId: string) => {
        // Удаляем задачу из состояния
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      },
    });
  };

  // Функция для добавления новой задачи
  const handleAddTask = () => {
    navigation.navigate('EditTask', {
      listId,          // передаем ID текущего списка
      groupId,         // передаем ID текущей группы
      listTitle,       // передаем название списка
      isEditing: false, // указываем, что это создание новой задачи
      onTaskUpdate: (newTask: Task) => {
        // Добавляем новую задачу в текущий список
        setTasks(prevTasks => [...prevTasks, newTask]);
      },
    });
  };

  // Функция для сохранения списка
  const handleSaveList = (updatedList: TaskList) => {
    setCurrentList(updatedList);
    
    // Обновляем параметры навигации
    navigation.setParams({
      listTitle: updatedList.title,
      listIcon: updatedList.icon,
      listColor: updatedList.color,
      backgroundColor: updatedList.backgroundColor
    });
    
    setEditModalVisible(false);
    setMenuVisible(false);
  };

  // Разделение задач на выполненные и невыполненные
  const uncompletedTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setMenuVisible(false);
        setFilterMenuVisible(false);
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{listTitle}</Text>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.menuButton} onPress={() => setFilterMenuVisible(!sortMenuVisible)}>
                <Icon name="filter" size={24} color="black" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(!menuVisible)}>
                <Icon name="more-vertical" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {sortMenuVisible && (
              <View style={styles.sortMenuPopup}>
                <TouchableOpacity
                  style={[styles.menuItem, filterType === 'Важность' && styles.selectedMenuItem]}
                  onPress={() => {
                    setFilterType('Важность');
                    setFilterMenuVisible(false);
                  }}
                >
                  <Text style={styles.menuText}>Важность</Text>
                  {filterType === 'Важность' && <Icon name="check" size={16} color="#6750A4" />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuItem, filterType === 'Приоритет' && styles.selectedMenuItem]}
                  onPress={() => {
                    setFilterType('Приоритет');
                    setFilterMenuVisible(false);
                  }}
                >
                  <Text style={styles.menuText}>Приоритет</Text>
                  {filterType === 'Приоритет' && <Icon name="check" size={16} color="#6750A4" />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuItem, filterType === 'Срочность' && styles.selectedMenuItem]}
                  onPress={() => {
                    setFilterType('Срочность');
                    setFilterMenuVisible(false);
                  }}
                >
                  <Text style={styles.menuText}>Срочность</Text>
                  {filterType === 'Срочность' && <Icon name="check" size={16} color="#6750A4" />}
                </TouchableOpacity>
              </View>
            )}

            {menuVisible && (
              <View style={styles.menuPopup}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setEditModalVisible(true);
                    setMenuVisible(false);
                  }}
                >
                  <Text style={styles.menuText}>Редактировать список</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <ScrollView style={styles.content}>
            {/* Невыполненные задачи */}
            {uncompletedTasks.length > 0 && (
              <View style={styles.taskSection}>
                {uncompletedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleTaskCompletion}
                    onToggleStar={toggleTaskStarred}
                    onPress={() => handleEditTask(task)}
                  />
                ))}
              </View>
            )}

            {/* Выполненные задачи */}
            {completedTasks.length > 0 && (
              <View style={styles.taskSection}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => setIsSectionCollapsed(!isSectionCollapsed)}
                >
                  <Icon name={isSectionCollapsed ? 'fa-caret-right' : 'fa-caret-down'} size={24} color="black" />
                  <Text style={styles.sectionTitle}>Выполнено ({completedTasks.length})</Text>
                </TouchableOpacity>

                {!isSectionCollapsed &&
                  completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskCompletion}
                      onToggleStar={toggleTaskStarred}
                      onPress={() => handleEditTask(task)}
                    />
                  ))}
              </View>
            )}

            {tasks.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>В этом списке пока нет задач</Text>
              </View>
            )}
          </ScrollView>

          {/* Большая кнопка добавления задачи */}
          <TouchableOpacity style={styles.addTaskButton} onPress={handleAddTask}>
            <Icon name="add" size={32} color="#6750A4" />
          </TouchableOpacity>
        </View>
        <EditTaskListModal
          visible={editModalVisible}
          taskList={currentList}
          groups={[]}
          currentGroupId={groupId}
          onClose={() => setEditModalVisible(false)}
          onSave={handleSaveList}
          onSelectGroup={() => {}}
        />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E0EB',
    position: 'relative',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  menuPopup: {
    position: 'absolute',
    right: 16,
    top: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  sortMenuPopup: {
    position: 'absolute',
    right: 50,
    top: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
    minWidth: 150,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedMenuItem: {
    backgroundColor: 'rgba(103, 80, 164, 0.1)',
  },
  menuText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  taskSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E0EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  addTaskButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

