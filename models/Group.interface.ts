import {TaskList} from './TaskList.interface';

export interface Group {
  id: string;
  title: string;
  lists: TaskList[];
}
