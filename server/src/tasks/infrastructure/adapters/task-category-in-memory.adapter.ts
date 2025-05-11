import { EntityInMemoryAdapter } from '../../../common/adapters';
import {
  TaskCategory,
  TaskCategoryFilterCriteria,
} from '../../application/entities';
import { TaskCategoriesPort } from '../../application/ports';

export class TaskCategoryInMemoryAdapter
  extends EntityInMemoryAdapter<TaskCategory, TaskCategoryFilterCriteria>
  implements TaskCategoriesPort
{
  constructor() {
    super();
    this.entities.push(new TaskCategory('1', 'Category #1', 'red'));
  }
}
