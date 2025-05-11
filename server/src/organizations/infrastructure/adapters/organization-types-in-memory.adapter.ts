import { Injectable } from '@nestjs/common';
import {
  OrganizationTypeFilterCriteria,
  OrganizationTypesPort,
} from '../../applications/ports';
import { EntityInMemoryAdapter } from '../../../common/adapters';
import { OrganizationType } from '../../applications/entities';

@Injectable()
export class OrganizationTypesInMemoryAdapter
  extends EntityInMemoryAdapter<
    OrganizationType,
    OrganizationTypeFilterCriteria
  >
  implements OrganizationTypesPort
{
  constructor() {
    super();
    this.entities.push(
      new OrganizationType('1', 'Подведомственное учреждение'),
      new OrganizationType('2', 'Исполнительный орган'),
    );
  }
}
