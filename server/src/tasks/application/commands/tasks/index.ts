import { CreateTaskCommandHandler } from './create-task.command-handler';
import { UpdateTaskCommandHandler } from './update-task.command-handler';
import { DeleteTaskCommandHandler } from './delete-task.command-handler';

export { CreateTaskCommand } from './create-task.command';
export { UpdateTaskCommand } from './update-task.command';
export { DeleteTaskCommand } from './delete-task.command';

export const handlers = [
  CreateTaskCommandHandler,
  UpdateTaskCommandHandler,
  DeleteTaskCommandHandler,
];
