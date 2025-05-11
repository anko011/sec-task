import { FindPaginatedTaskCategoriesHandler } from './find-paginated-task-categories.handler';
import { FindTaskCategoryHandler } from './find-task-category.handler';

export { FindTaskCategoryQuery } from './find-task-category.query';
export { FindPaginatedTaskCategoriesQuery } from './find-paginated-task-categories.query';

export const handlers = [
  FindPaginatedTaskCategoriesHandler,
  FindTaskCategoryHandler,
];
