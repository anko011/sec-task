import { CreateOrganizationCommandHandler } from './create-organization.handler';
import { UpdateOrganizationCommandHandler } from './update-organization.handler';
import { DeleteOrganizationCommandHandler } from './delete-organization.handler';

export { CreateOrganizationCommand } from './create-organization.command';
export { UpdateOrganizationCommand } from './update-organization.command';
export { DeleteOrganizationCommand } from './delete-organization.command';

export const handlers = [
  CreateOrganizationCommandHandler,
  UpdateOrganizationCommandHandler,
  DeleteOrganizationCommandHandler,
];
