import { FindPaginatedTasksQueryHandler } from './find-paginated-tasks.handler';
import { FindTaskQueryHandler } from './find-task.handler';
import { FindTaskExecutionByOrganizationQueryHandler } from './find-task-execution-by-organization.handler';
import { FindTaskExecutionQueryHandler } from './find-task-executions.handler';
import { FindTaskExecutionHistoriesQueryHandler } from '~/tasks/application/queries/tasks/find-task-execution-histories.handler';

export { FindTaskQuery } from './find-task.query';
export { FindPaginatedTasksQuery } from './find-paginated-tasks.query';
export { FindTaskExecutionByOrganizationQuery } from './find-task-execution-by-organization.query';
export { FindTaskExecutionsQuery } from './find-task-executions.query';
export { FindTaskExecutionHistoriesQuery } from './find-task-execution-histories.query';

export const handlers = [
  FindPaginatedTasksQueryHandler,
  FindTaskQueryHandler,
  FindTaskExecutionByOrganizationQueryHandler,
  FindTaskExecutionQueryHandler,
  FindTaskExecutionHistoriesQueryHandler,
];
