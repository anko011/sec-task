import { CreateTaskPackageCommandHandler } from './create-task-package.command-handler';
import { UpdateTaskPackageCommandHandler } from './update-task-package.command-handler';
import { DeleteTaskPackageCommandHandler } from './delete-task-package.command-handler';

export { CreateTaskPackageCommand } from './create-task-package.command';
export { UpdateTaskPackageCommand } from './update-task-package.command';
export { DeleteTaskPackageCommand } from './delete-task-package.command';

export const handlers = [
  CreateTaskPackageCommandHandler,
  UpdateTaskPackageCommandHandler,
  DeleteTaskPackageCommandHandler,
];
