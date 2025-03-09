'use client';

import { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Icon } from '../components/Icons';
import type { TaskList } from '../models/TaskList.interface';
import type { Group } from '../models/Group.interface';
import { EditTaskListModal } from '../components/EditTaskListModal';
import { EditGroupModal } from '../components/EditGroupModal';

const MOCK_GROUPS: Group[] = [
  {
    id: '1',
    title: 'Хобби',
    lists: [
      { id: '1-1', title: 'Спорт', count: 12, icon: '⚽', color: '#FF6B6B', backgroundColor: '#FFF5F5' },
      { id: '1-2', title: 'Чтение', count: 5, icon: '📚', color: '#4ECDC4', backgroundColor: '#F0FFF4' },
      { id: '1-3', title: 'Музыка', count: 3, icon: '🎵', color: '#45B7D1', backgroundColor: '#EBFBFF' },
    ],
  },
  {
    id: '2',
    title: 'Работа',
    lists: [
      { id: '2-1', title: 'Проекты', count: 8, icon: '💼', color: '#9B59B6', backgroundColor: '#F3F0FF' },
      { id: '2-2', title: 'Встречи', count: 4, icon: '👥', color: '#3498DB', backgroundColor: '#F0F9FF' },
    ],
  },
  {
    id: '3',
    title: 'Учеба',
    lists: [
      { id: '3-1', title: 'Курсы', count: 2, icon: '🎓', color: '#FFEEAD', backgroundColor: '#FFFBEB' },
      { id: '3-2', title: 'Книги', count: 7, icon: '📖', color: '#D4A5A5', backgroundColor: '#FFF0F6' },
    ],
  },
];

export default function HomeScreen({ navigation }) {
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [activeMenu, setActiveMenu] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentTaskList, setCurrentTaskList] = useState<TaskList | undefined>(undefined);
  const [currentGroupId, setCurrentGroupId] = useState<string | undefined>(undefined);
  const [editGroupModalVisible, setEditGroupModalVisible] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | undefined>(undefined);

  const animatedHeights = useRef({}).current;

  const getGroupAnimation = (groupId) => {
    if (!animatedHeights[groupId]) {
      animatedHeights[groupId] = new Animated.Value(1);
    }
    return animatedHeights[groupId];
  };

  const toggleGroupCollapse = (groupId) => {
    setCollapsedGroups((prev) => {
      const newState = { ...prev, [groupId]: !prev[groupId] };

      Animated.timing(getGroupAnimation(groupId), {
        toValue: newState[groupId] ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      return newState;
    });
  };

  const toggleMenu = (menuId) => {
    if (activeMenu === menuId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuId);
    }
  };

  const closeAllMenus = () => {
    setActiveMenu(null);
  };

  const handleEditTaskList = (taskList: TaskList, groupId: string) => {
    setCurrentTaskList(taskList);
    setCurrentGroupId(groupId);
    setEditModalVisible(true);
    closeAllMenus();
  };

  // Добавляем обработчик для создания нового списка
  const handleCreateList = () => {
    setCurrentTaskList(undefined); // Очищаем текущий список для создания нового
    setCurrentGroupId(groups[0].id); // По умолчанию выбираем первую группу
    setEditModalVisible(true);
  };

  // Обновляем handleSaveTaskList для поддержки создания нового списка
  const handleSaveTaskList = (taskList: TaskList) => {
    if (!currentGroupId) {
      return;
    }

    setGroups((prevGroups) => {
      return prevGroups.map((group) => {
        if (group.id === currentGroupId) {
          if (!taskList.id) {
            // Создаем новый список
            const newList = {
              ...taskList,
              id: `${currentGroupId}-${Date.now()}`, // Генерируем уникальный ID
              count: 0, // Начальное количество задач
            };
            return {
              ...group,
              lists: [...group.lists, newList],
            };
          } else {
            // Обновляем существующий список
            return {
              ...group,
              lists: group.lists.map((list) => (list.id === taskList.id ? taskList : list)),
            };
          }
        }
        return group;
      });
    });

    setEditModalVisible(false);
  };

  // Добавляем обработчики для групп
  const handleCreateGroup = () => {
    setCurrentGroup(undefined);
    setEditGroupModalVisible(true);
  };

  const handleEditGroup = (group: Group) => {
    setCurrentGroup(group);
    setEditGroupModalVisible(true);
    closeAllMenus();
  };

  const handleSaveGroup = (group: Partial<Group>) => {
    if (group.id) {
      // Редактирование существующей группы
      setGroups((prevGroups) => prevGroups.map((g) => (g.id === group.id ? { ...g, title: group.title! } : g)));
    } else {
      // Создание новой группы
      const newGroup: Group = {
        id: Date.now().toString(),
        title: group.title!,
        lists: [],
      };
      setGroups((prev) => [...prev, newGroup]);
    }
    setEditGroupModalVisible(false);
  };

  // Добавляем функцию удаления списка
  const handleDeleteList = (taskId: string, groupId: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            lists: group.lists.filter((list) => list.id !== taskId),
          };
        }
        return group;
      }),
    );
    closeAllMenus();
  };

  // Добавляем функцию удаления группы
  const handleDeleteGroup = (groupId: string) => {
    setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
    closeAllMenus();
  };

  // Обновляем renderTaskItem для добавления обработчика удаления
  const renderTaskItem = (task: TaskList, groupId: string) => {
    const menuId = `list-${task.id}`;

    return (
      <View key={menuId} style={styles.taskCard}>
        <TouchableOpacity
          style={styles.taskLeft}
          onPress={() =>
            navigation.navigate('TaskList', {
              listId: task.id,
              groupId: groupId,
              listTitle: task.title,
            })
          }
        >
          <View style={[styles.taskIcon, { backgroundColor: task.color || '#8B4513' }]}>
            <Text style={styles.taskIconText}>{task.icon}</Text>
          </View>
          <View style={styles.taskTextContainer}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskCount}>{task.count} задач</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.taskRight}>
          {activeMenu === menuId && (
            <View style={styles.menuPopup}>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleDeleteList(task.id!, groupId)}>
                <Text style={styles.menuText}>Удалить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleEditTaskList(task, groupId)}>
                <Text style={styles.menuText}>Редактировать</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={() => toggleMenu(menuId)}>
            <Icon name="more-vertical" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
          style={styles.taskLeft}
          onPress={() =>
            navigation.navigate('TaskList', {
              listId: task.id,
              groupId: groupId,
              listTitle: task.title,
            })
          }
        >
            <Icon name="arrow-forward-ios" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Обновляем renderGroup для добавления обработчика удаления
  const renderGroup = (group: Group) => {
    const menuId = `group-${group.id}`;
    const isCollapsed = collapsedGroups[group.id] || false;
    const animatedHeight = getGroupAnimation(group.id);

    return (
      <View key={group.id}>
        <View style={styles.sectionHeader}>
          {isCollapsed && <Icon name="format-list-bulleted" size={24} color="black" />}
          <Text style={styles.sectionTitle}>{group.title}</Text>
          <View style={styles.sectionActions}>
            <TouchableOpacity onPress={() => toggleMenu(menuId)}>
              <Icon name="more-vertical" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleGroupCollapse(group.id)}>
              <Icon name={isCollapsed ? 'fa-caret-left' : 'fa-caret-down'} size={24} color="black" />
            </TouchableOpacity>
          </View>

          {activeMenu === menuId && (
            <View style={[styles.menuPopup, styles.hobbyMenu]}>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleDeleteGroup(group.id)}>
                <Text style={styles.menuText}>Удалить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleEditGroup(group)}>
                <Text style={styles.menuText}>Редактировать</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Animated.View style={{ opacity: animatedHeight }}>
          {!isCollapsed && group.lists.map((task) => renderTaskItem(task, group.id))}
        </Animated.View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={closeAllMenus}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate('Profile')}>
              <Image source={require('../assets/profile.png')} style={styles.profileImage} />
              <Text style={styles.profileName}>Bob</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Icon name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            {groups.map((group) => renderGroup(group))}
          </ScrollView>

          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateList}>
              <Icon name="add" size={24} color="#6750A4" />
              <Text style={styles.createButtonText}>Создать список</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.floatingButton} onPress={handleCreateGroup}>
              <Icon name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Модальное окно редактирования/создания */}
        <EditTaskListModal
          visible={editModalVisible}
          taskList={currentTaskList}
          groups={groups}
          currentGroupId={currentGroupId}
          onSelectGroup={setCurrentGroupId}
          onClose={() => setEditModalVisible(false)}
          onSave={handleSaveTaskList}
        />

        <EditGroupModal
          visible={editGroupModalVisible}
          group={currentGroup}
          onClose={() => setEditGroupModalVisible(false)}
          onSave={handleSaveGroup}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E6E0EB',
    position: 'relative', // Для позиционирования меню
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7ECFC',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskIconText: {
    fontSize: 24,
  },
  taskTextContainer: {
    marginLeft: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskCount: {
    fontSize: 14,
    color: '#666',
  },
  taskRight: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  todayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E6E0EB',
  },
  todayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  todayRight: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  menuPopup: {
    position: 'absolute',
    right: 40,
    top: -10,
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
  todayMenu: {
    right: 40,
    top: -40,
  },
  hobbyMenu: {
    right: 60,
    top: 40,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E6E0EB',
    backgroundColor: '#fff',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createButtonText: {
    marginLeft: 8,
    color: '#6750A4',
    fontWeight: '500',
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6750A4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomSpacer: {
    height: 20,
  },
});

