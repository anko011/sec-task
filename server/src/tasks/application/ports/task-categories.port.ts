import { BaseEntityPort } from '../../../common/ports';
import { TaskCategory, TaskCategoryFilterCriteria } from '../entities';

export abstract class TaskCategoriesPort extends BaseEntityPort<
  TaskCategory,
  TaskCategoryFilterCriteria
> {}
