import { TaskCategory } from '../entities';

export abstract class TaskCategoriesPort {
  abstract find(categoryId: string): Promise<TaskCategory | null>;
}
