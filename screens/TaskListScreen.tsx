'use client';

import { useEffect, useState } from 'react';
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
import { observer } from 'mobx-react-lite';
import { Icon } from '../components/Icons';
import { TaskItem } from '../components/TaskItem';
import { EditTaskListModal } from '../components/EditTaskListModal';
import { TaskListViewModel } from '../viewModels/TaskListViewModel';
import { FakeTaskRepository } from '../repositories/TaskRepository';
import type { Task } from '../models/Task.interface';
import type { TaskList } from '../models/TaskList.interface';
import { toJS } from 'mobx';

interface TaskListScreenProps {
  route: {
    params: {
      listId: string;
      groupId: string;
      listTitle: string;
      listIcon?: string;
      listColor?: string;
      backgroundColor?: string;
    };
  };
  navigation: any;
}

export default observer(({ route, navigation }: TaskListScreenProps) => {
  const { listId, groupId, listTitle } = route.params;
  const [viewModel] = useState(() => new TaskListViewModel(
    new FakeTaskRepository(),
    listId,
    groupId,
    {
      title: listTitle,
      icon: route.params.listIcon,
      color: route.params.listColor,
      backgroundColor: route.params.backgroundColor
    }
  ));

  useEffect(() => {
    viewModel.loadTasks();
  }, []);

  const handleEditTask = (task?: Task) => {
    navigation.navigate('EditTask', {
      task: task ? toJS(task) : undefined,
      listId,
      groupId,
      listTitle,
      isEditing: !!task,
      onTaskUpdate: (newTask: Task) => {
        // Преобразуем объект в простой JS объект перед обновлением
        viewModel.updateTask(toJS(newTask));
      },
      onTaskDelete: viewModel.deleteTask,
    });
  };

  if (viewModel.state.isLoading) {
    return (
      <View style={styles.emptyState}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (viewModel.state.error) {
    return (
      <View style={styles.emptyState}>
        <Text>{viewModel.state.error}</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={viewModel.closeMenus}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{viewModel.state.currentList.title}</Text>

            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.menuButton} 
                onPress={viewModel.toggleFilterMenu}
              >
                <Icon name="filter" size={24} color="black" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuButton} 
                onPress={viewModel.toggleMenu}
              >
                <Icon name="more-vertical" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {viewModel.state.isFilterMenuVisible && (
              <View style={styles.sortMenuPopup}>
                {viewModel.filterTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.menuItem,
                      viewModel.state.filterType === type && styles.selectedMenuItem
                    ]}
                    onPress={() => viewModel.setFilterType(type)}
                  >
                    <Text style={styles.menuText}>{type}</Text>
                    {viewModel.state.filterType === type && (
                      <Icon name="check" size={16} color="#6750A4" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {viewModel.state.isMenuVisible && (
              <View style={styles.menuPopup}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={viewModel.showEditModal}
                >
                  <Text style={styles.menuText}>Редактировать список</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <ScrollView style={styles.content}>
            {/* Невыполненные задачи */}
            {viewModel.uncompletedTasks.length > 0 && (
              <View style={styles.taskSection}>
                {viewModel.uncompletedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={viewModel.toggleTaskCompletion}
                    onToggleStar={viewModel.toggleTaskStar}
                    onPress={() => handleEditTask(task)}
                  />
                ))}
              </View>
            )}

            {/* Выполненные задачи */}
            {viewModel.completedTasks.length > 0 && (
              <View style={styles.taskSection}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={viewModel.toggleSectionCollapsed}
                >
                  <Icon 
                    name={viewModel.state.isSectionCollapsed ? 'fa-caret-right' : 'fa-caret-down'} 
                    size={24} 
                    color="black" 
                  />
                  <Text style={styles.sectionTitle}>
                    Выполнено ({viewModel.completedTasks.length})
                  </Text>
                </TouchableOpacity>

                {!viewModel.state.isSectionCollapsed &&
                  viewModel.completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={viewModel.toggleTaskCompletion}
                      onToggleStar={viewModel.toggleTaskStar}
                      onPress={() => handleEditTask(task)}
                    />
                  ))}
              </View>
            )}

            {viewModel.state.tasks.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>В этом списке пока нет задач</Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity 
            style={styles.addTaskButton} 
            onPress={() => handleEditTask()}
          >
            <Icon name="add" size={32} color="#6750A4" />
          </TouchableOpacity>
        </View>

        <EditTaskListModal
          visible={viewModel.state.isEditModalVisible}
          taskList={viewModel.state.currentList}
          groups={[]}
          currentGroupId={groupId}
          onClose={viewModel.hideEditModal}
          onSave={viewModel.updateList}
          onSelectGroup={() => {}}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
});

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

