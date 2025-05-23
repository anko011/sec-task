import { CreateTaskPackageCommandHandler } from './create-task-package.handler';
import { UpdateTaskPackageCommandHandler } from './update-task-package.handler';
import { DeleteTaskPackageCommandHandler } from './delete-task-package.handler';
import { UploadFilesCommandHandler } from './upload-files.handler';
import { FixTaskPackageCommandHandler } from '~/tasks/application/commands/task-packages/fix-task-package.handler';

export { CreateTaskPackageCommand } from './create-task-package.command';
export { UpdateTaskPackageCommand } from './update-task-package.command';
export { DeleteTaskPackageCommand } from './delete-task-package.command';
export { UploadFilesCommand } from './upload-files.command';
export { FixTaskPackageCommand } from './fix-task-package.command';

export const handlers = [
  UploadFilesCommandHandler,
  CreateTaskPackageCommandHandler,
  UpdateTaskPackageCommandHandler,
  DeleteTaskPackageCommandHandler,
  FixTaskPackageCommandHandler,
];
