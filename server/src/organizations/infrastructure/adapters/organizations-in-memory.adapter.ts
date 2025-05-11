import { Injectable } from '@nestjs/common';
import {
  OrganizationFilterCriteria,
  OrganizationsPort,
} from '../../applications/ports';
import { EntityInMemoryAdapter } from '../../../common/adapters';
import { Organization, OrganizationType } from '../../applications/entities';

@Injectable()
export class OrganizationsInMemoryAdapter
  extends EntityInMemoryAdapter<Organization, OrganizationFilterCriteria>
  implements OrganizationsPort
{
  constructor() {
    super();
    this.entities.push(
      new Organization(
        '1',
        new OrganizationType('1', 'Подведомственное учреждение'),
        'Администрация Железнодорожного района г. Чита',
        false,
      ),
      new Organization(
        '2',
        new OrganizationType('2', 'Исполнительный орган'),
        'Администрация поселка Атамановка (г. Чита)',
        false,
      ),
    );
  }
}
