import { FindOrganizationQueryHandler } from './find-organization.handler';
import { FindPaginatedOrganizationsQueryHandler } from './find-paginated-organizations.handler';

export { FindOrganizationQuery } from './find-organization.query';
export { FindPaginatedOrganizationsQuery } from './find-paginated-organizations.query';

export const handlers = [
  FindOrganizationQueryHandler,
  FindPaginatedOrganizationsQueryHandler,
];
