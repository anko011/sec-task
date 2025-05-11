import { CreateTaskCommandHandler } from './create-task.handler';
import { UpdateTaskCommandHandler } from './update-task.handler';
import { DeleteTaskCommandHandler } from './delete-task.handler';
import { ChangeTaskStatusCommandHandler } from './change-task-status.handler';

export { CreateTaskCommand } from './create-task.command';
export { UpdateTaskCommand } from './update-task.command';
export { DeleteTaskCommand } from './delete-task.command';
export { ChangeTaskStatusCommand } from './change-task-status.command';

export const handlers = [
  CreateTaskCommandHandler,
  UpdateTaskCommandHandler,
  DeleteTaskCommandHandler,
  ChangeTaskStatusCommandHandler,
];
