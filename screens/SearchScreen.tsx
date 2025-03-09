"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native"
import { Icon } from "../components/Icons"
import { TaskItem } from "../components/TaskItem"
import type { Task } from "../models/Task.interface"

// Мок-данные для задач
const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Сходить на тренировку",
    completed: false,
    priority: "Неважно",
    starred: false,
    listId: "1-1",
    groupId: "1",
  },
  {
    id: "2",
    title: "Поменять перчатки",
    completed: false,
    priority: "Важно",
    starred: false,
    listId: "1-1",
    groupId: "1",
  },
  {
    id: "3",
    title: "Изучить новые упражнения",
    completed: false,
    priority: "Нейтрально",
    starred: false,
    listId: "1-1",
    groupId: "1",
  },
  {
    id: "4",
    title: "Изучить новые упражнения для пресса",
    completed: true,
    priority: "Нейтрально",
    starred: false,
    listId: "1-1",
    groupId: "1",
  },
  {
    id: "5",
    title: "Изучить новые упражнения для спины",
    completed: true,
    priority: "Нейтрально",
    starred: false,
    listId: "1-1",
    groupId: "1",
  },
  {
    id: "6",
    title: "Изучить новые упражнения для ног",
    completed: true,
    priority: "Нейтрально",
    starred: false,
    listId: "1-1",
    groupId: "1",
  },
  {
    id: "7",
    title: "Изучить новые упражнения для рук",
    completed: true,
    priority: "Нейтрально",
    starred: false,
    listId: "1-1",
    groupId: "1",
  },
  {
    id: "8",
    title: "Купить новые кроссовки",
    completed: false,
    priority: "Важно",
    starred: true,
    listId: "1-2",
    groupId: "1",
  },
  {
    id: "9",
    title: "Записаться на массаж",
    completed: false,
    priority: "Неважно",
    starred: true,
    listId: "1-2",
    groupId: "1",
  },
  {
    id: "10",
    title: "Подготовить отчет",
    completed: false,
    priority: "Важно",
    starred: false,
    listId: "2-1",
    groupId: "2",
  },
]

export default function SearchScreen({ navigation, route }) {
  const { updatedTask, deletedTaskId } = route.params || {}
  const [searchQuery, setSearchQuery] = useState("")
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS)
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [hideCompleted, setHideCompleted] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false)

  // Эффект для фильтрации задач при изменении поискового запроса или флага hideCompleted
  useEffect(() => {
    let filtered = tasks

    // Фильтрация по поисковому запросу
    if (searchQuery) {
      filtered = filtered.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Фильтрация по статусу выполнения
    if (hideCompleted) {
      filtered = filtered.filter((task) => !task.completed)
    }

    setFilteredTasks(filtered)
  }, [searchQuery, tasks, hideCompleted])

  // Обработка обновленной или удаленной задачи
  useEffect(() => {
    if (updatedTask) {
      setTasks((prevTasks) => {
        const taskExists = prevTasks.some((task) => task.id === updatedTask.id)
        if (taskExists) {
          // Обновляем существующую задачу
          return prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        } else {
          // Добавляем новую задачу
          return [...prevTasks, updatedTask]
        }
      })
    }

    if (deletedTaskId) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deletedTaskId))
    }
  }, [updatedTask, deletedTaskId])

  // Функция для переключения статуса выполнения задачи
  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    )
  }

  // Функция для переключения статуса "избранное" задачи
  const toggleTaskStarred = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, starred: !task.starred } : task)))
  }

  // Функция для редактирования задачи
  const handleEditTask = (task: Task) => {
    navigation.navigate('EditTask', {
      task,
      listId: task.listId,
      groupId: task.groupId,
      listTitle: 'Редактирование',
      isEditing: true,
      onTaskUpdate: (updatedTask: Task) => {
        // Обновляем состояние задач
        setTasks(prevTasks => 
          prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        );
      },
      onTaskDelete: (taskId: string) => {
        // Удаляем задачу из состояния
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      }
    });
  };

  // Разделение задач на выполненные и невыполненные
  const uncompletedTasks = filteredTasks.filter((task) => !task.completed)
  const completedTasks = filteredTasks.filter((task) => task.completed)

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="black" />
            </TouchableOpacity>

            <TextInput
              style={styles.searchInput}
              placeholder="Поиск задач..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />

            <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(!menuVisible)}>
              <Icon name="more-vertical" size={24} color="black" />
            </TouchableOpacity>

            {menuVisible && (
              <View style={styles.menuPopup}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setHideCompleted(!hideCompleted)
                    setMenuVisible(false)
                  }}
                >
                  <Text style={styles.menuText}>{hideCompleted ? "Показать выполненные" : "Спрятать выполненные"}</Text>
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
                  <Icon name={isSectionCollapsed ? "fa-caret-right" : "fa-caret-down"} size={24} color="black" />
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

            {filteredTasks.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery ? `Ничего не найдено по запросу "${searchQuery}"` : "Введите текст для поиска задач"}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E0EB",
    position: "relative",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  menuPopup: {
    position: "absolute",
    right: 16,
    top: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E0EB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
})

