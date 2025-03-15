import {makeAutoObservable, runInAction} from 'mobx';
import type {Task, TaskList} from '../models/Task.interface';
import type {ITaskRepository} from '../repositories/TaskRepository';

export interface TaskListState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filterType: 'Важность' | 'Приоритет' | 'Срочность';
  isSectionCollapsed: boolean;
  isMenuVisible: boolean;
  isFilterMenuVisible: boolean;
  isEditModalVisible: boolean;
  currentList: TaskList;
}

export class TaskListViewModel {
  state: TaskListState = {
    tasks: [],
    isLoading: false,
    error: null,
    filterType: 'Важность',
    isSectionCollapsed: false,
    isMenuVisible: false,
    isFilterMenuVisible: false,
    isEditModalVisible: false,
    currentList: {} as TaskList,
  };

  readonly filterTypes = ['Важность', 'Приоритет', 'Срочность'] as const;

  constructor(
    private repository: ITaskRepository,
    private listId: string,
    private groupId: string,
    initialList: Partial<TaskList>,
  ) {
    makeAutoObservable(this);
    this.state.currentList = {
      id: listId,
      ...initialList,
    } as TaskList;
  }

  loadTasks = async () => {
    try {
      this.state.isLoading = true;
      const tasks = await this.repository.getTasks(this.listId, this.groupId);
      runInAction(() => {
        this.state.tasks = tasks;
        this.state.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.state.error = error.message;
        this.state.isLoading = false;
      });
    }
  };

  toggleTaskCompletion = async (taskId: string) => {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = {...task, completed: !task.completed};
      await this.repository.updateTask(updatedTask);
      runInAction(() => {
        this.state.tasks = this.state.tasks.map(t =>
          t.id === taskId ? updatedTask : t,
        );
      });
    }
  };

  toggleTaskStar = async (taskId: string) => {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = {...task, starred: !task.starred};
      await this.repository.updateTask(updatedTask);
      runInAction(() => {
        this.state.tasks = this.state.tasks.map(t =>
          t.id === taskId ? updatedTask : t,
        );
      });
    }
  };

  updateTask = async (task: Task) => {
    const updatedTask = await this.repository.updateTask(task);
    runInAction(() => {
      // Если задача новая (нет в списке) - добавляем
      const existingTask = this.state.tasks.find(t => t.id === task.id);
      if (!existingTask) {
        this.state.tasks = [...this.state.tasks, updatedTask];
      } else {
        // Иначе обновляем существующую
        this.state.tasks = this.state.tasks.map(t =>
          t.id === task.id ? updatedTask : t,
        );
      }
    });
  };

  deleteTask = async (taskId: string) => {
    await this.repository.deleteTask(taskId);
    runInAction(() => {
      this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
    });
  };

  updateList = (list: TaskList) => {
    this.state.currentList = list;
    this.hideEditModal();
  };

  setFilterType = (type: 'Важность' | 'Приоритет' | 'Срочность') => {
    this.state.filterType = type;
    this.state.isFilterMenuVisible = false;
  };

  toggleSectionCollapsed = () => {
    this.state.isSectionCollapsed = !this.state.isSectionCollapsed;
  };

  toggleMenu = () => {
    this.state.isMenuVisible = !this.state.isMenuVisible;
    this.state.isFilterMenuVisible = false;
  };

  toggleFilterMenu = () => {
    this.state.isFilterMenuVisible = !this.state.isFilterMenuVisible;
    this.state.isMenuVisible = false;
  };

  closeMenus = () => {
    this.state.isMenuVisible = false;
    this.state.isFilterMenuVisible = false;
  };

  showEditModal = () => {
    this.state.isEditModalVisible = true;
    this.closeMenus();
  };

  hideEditModal = () => {
    this.state.isEditModalVisible = false;
  };

  get uncompletedTasks() {
    return this.state.tasks.filter(task => !task.completed);
  }

  get completedTasks() {
    return this.state.tasks.filter(task => task.completed);
  }
}
