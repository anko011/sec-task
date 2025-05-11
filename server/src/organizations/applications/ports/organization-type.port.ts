import { OrganizationType } from '../entities';
import { BaseEntityPort } from '../../../common/ports';

export type OrganizationTypeFilterCriteria = {
  id?: string;
  name?: string;
};

export abstract class OrganizationTypesPort extends BaseEntityPort<
  OrganizationType,
  OrganizationTypeFilterCriteria
> {}
