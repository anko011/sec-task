import { FindOrganizationTypeQueryHandler } from './find-organization-type.query-handler';
import { FindPaginatedOrganizationTypesQueryHandler } from './find-paginated-organization-types.query-handler';

export { FindOrganizationTypeQuery } from './find-organization-type.query';
export { FindPaginatedOrganizationTypesQuery } from './find-paginated-organization-types.query';

export const handlers = [
  FindOrganizationTypeQueryHandler,
  FindPaginatedOrganizationTypesQueryHandler,
];
