import { CreateOrganizationTypeCommandHandler } from './create-organization-type.handler';
import { UpdateOrganizationTypeCommandHandler } from './update-organization-type.handler';
import { DeleteOrganizationTypeCommandHandler } from './delete-organization-type.handler';

export { CreateOrganizationTypeCommand } from './create-organization-type.command';
export { UpdateOrganizationTypeCommand } from './update-organization-type.command';
export { DeleteOrganizationTypeCommand } from './delete-organization-type.command';

export const handlers = [
  CreateOrganizationTypeCommandHandler,
  UpdateOrganizationTypeCommandHandler,
  DeleteOrganizationTypeCommandHandler,
];
