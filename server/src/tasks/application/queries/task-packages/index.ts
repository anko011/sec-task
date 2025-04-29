import { FindPaginatedTaskPackagesQueryHandler } from './find-paginated-task-packages.query-handler';
import { FindTaskPackageQueryHandler } from './find-task-package.query-handler';

export { FindTaskPackageQuery } from './find-task-package.query';
export { FindPaginatedTaskPackagesQuery } from './find-paginated-task-packages.query';

export const handlers = [
  FindPaginatedTaskPackagesQueryHandler,
  FindTaskPackageQueryHandler,
];
