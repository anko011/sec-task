import { Action } from '../../../ability/application/factories';
import { OrganizationType } from '../../applications/entities';
import { createSubjectPolices } from '../../../ability/infrastructure';

export const [
  ReadOrganizationTypePolicy,
  CreateOrganizationTypePolicy,
  UpdateOrganizationTypePolicy,
  DeleteOrganizationTypePolicy,
] = createSubjectPolices(
  [Action.Read, Action.Create, Action.Update, Action.Delete],
  OrganizationType,
);
