import { FindPaginatedTasksQueryHandler } from './find-paginated-tasks.handler';
import { FindTaskQueryHandler } from './find-task.handler';
import { FindTaskExecutionQueryHandler } from './find-task-execution.handler';

export { FindTaskQuery } from './find-task.query';
export { FindPaginatedTasksQuery } from './find-paginated-tasks.query';
export { FindTaskExecutionQuery } from './find-task-execution.query';

export const handlers = [
  FindPaginatedTasksQueryHandler,
  FindTaskQueryHandler,
  FindTaskExecutionQueryHandler,
];
