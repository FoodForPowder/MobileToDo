import {Task} from '../models/Task.interface';

export interface ITaskRepository {
  getTasks(listId: string, groupId: string): Promise<Task[]>;
  updateTask(task: Task): Promise<Task>;
  deleteTask(taskId: string): Promise<boolean>;
}

export class FakeTaskRepository implements ITaskRepository {
  private tasks: Task[] = [
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

  async getTasks(listId: string, groupId: string): Promise<Task[]> {
    return this.tasks.filter(
      task => task.listId === listId && task.groupId === groupId,
    );
  }

  async updateTask(task: Task): Promise<Task> {
    const taskToUpdate = this.tasks.find(t => t.id === task.id);
    if (!taskToUpdate) {
      // Если задача новая - добавляем в массив
      this.tasks.push(task);
    } else {
      // Иначе обновляем существующую
      this.tasks = this.tasks.map(t => (t.id === task.id ? task : t));
    }
    return task;
  }

  async deleteTask(taskId: string): Promise<boolean> {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    return true;
  }
}
