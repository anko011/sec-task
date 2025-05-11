import { Action } from '../../../ability/application/factories';
import { Organization } from '../../applications/entities';
import { createSubjectPolices } from '../../../ability/infrastructure';

export const [
  ReadOrganizationPolicy,
  CreateOrganizationPolicy,
  UpdateOrganizationPolicy,
  DeleteOrganizationPolicy,
] = createSubjectPolices(
  [Action.Read, Action.Create, Action.Update, Action.Delete],
  Organization,
);
