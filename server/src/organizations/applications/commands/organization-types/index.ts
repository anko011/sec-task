import { CreateOrganizationCommandHandler } from './create-organization-command.handler';
import { UpdateOrganizationCommandHandler } from './update-organization-command.handler';
import { DeleteOrganizationCommandHandler } from './delete-organization-command.handler';

export { CreateOrganizationTypeCommand } from './create-organization-type.command';
export { UpdateOrganizationTypeCommand } from './update-organization-type.command';
export { DeleteOrganizationTypeCommand } from './delete-organization-type.command';

export const handlers = [
  CreateOrganizationCommandHandler,
  UpdateOrganizationCommandHandler,
  DeleteOrganizationCommandHandler,
];
