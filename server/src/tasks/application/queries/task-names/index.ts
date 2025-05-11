import { FindPaginatedTaskNamesHandler } from './find-paginated-task-names.handler';
import { FindTaskNameHandler } from './find-task-name.handler';

export { FindTaskNameQuery } from './find-task-name.query';
export { FindPaginatedTaskNamesQuery } from './find-paginated-task-names.query';

export const handlers = [FindPaginatedTaskNamesHandler, FindTaskNameHandler];
