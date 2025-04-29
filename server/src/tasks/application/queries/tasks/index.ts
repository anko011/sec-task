import { FindTaskQueryHandler } from './find-task.query-handler';
import { FindPaginatedTasksQueryHandler } from './find-paginated-tasks.query-handler';

export { FindTaskQuery } from './find-task.query';
export { FindPaginatedTasksQuery } from './find-paginated-tasks.query';

export const handlers = [FindTaskQueryHandler, FindPaginatedTasksQueryHandler];
