import { CreateTaskPackageCommandHandler } from './create-task-package.handler';
import { UpdateTaskPackageCommandHandler } from './update-task-package.handler';
import { DeleteTaskPackageCommandHandler } from './delete-task-package.handler';

export { CreateTaskPackageCommand } from './create-task-package.command';
export { UpdateTaskPackageCommand } from './update-task-package.command';
export { DeleteTaskPackageCommand } from './delete-task-package.command';

export const handlers = [
  CreateTaskPackageCommandHandler,
  UpdateTaskPackageCommandHandler,
  DeleteTaskPackageCommandHandler,
];
