import { CreateTaskCategoryCommandHandler } from './create-task-category.handler';
import { UpdateTaskCategoryCommandHandler } from './update-task-category.handler';
import { DeleteTaskCategoryCommandHandler } from './delete-task-category.handler';

export { CreateTaskCategoryCommand } from './create-task-category.command';
export { UpdateTaskCategoryCommand } from './update-task-category.command';
export { DeleteTaskCategoryCommand } from './delete-task-category.command';

export const handlers = [
  CreateTaskCategoryCommandHandler,
  UpdateTaskCategoryCommandHandler,
  DeleteTaskCategoryCommandHandler,
];
