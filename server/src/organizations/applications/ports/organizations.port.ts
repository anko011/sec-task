import { Organization, OrganizationType } from '../entities';
import { BaseEntityPort } from '../../../common/ports';

export type OrganizationFilterCriteria = {
  id?: string;
  name?: string;
  type?: OrganizationType;
  isArchived?: boolean;
};

export abstract class OrganizationsPort extends BaseEntityPort<
  Organization,
  OrganizationFilterCriteria
> {}
