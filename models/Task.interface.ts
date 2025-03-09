export type TaskPriority = 'Неважно' | 'Важно' | 'Нейтрально';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  starred: boolean;
  listId: string;
  groupId: string;
  notes?: string;
  reminderDate?: string;
  deadlineDate?: string;
}
