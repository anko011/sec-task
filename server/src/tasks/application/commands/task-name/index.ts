import { CreateTaskNameCommandHandler } from './create-task-name.handler';
import { UpdateTaskNameCommandHandler } from './update-task-name.handler';
import { DeleteTaskNameCommandHandler } from './delete-task-name.handler';

export { CreateTaskNameCommand } from './create-task-name.command';
export { UpdateTaskNameCommand } from './update-task-name.command';
export { DeleteTaskNameCommand } from './delete-task-name.command';

export const handlers = [
  CreateTaskNameCommandHandler,
  UpdateTaskNameCommandHandler,
  DeleteTaskNameCommandHandler,
];
