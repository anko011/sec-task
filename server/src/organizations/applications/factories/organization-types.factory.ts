import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { OrganizationType } from '../entities';

@Injectable()
export class OrganizationTypesFactory {
  create({ name }: { name: string }) {
    const id = uuidv4();
    return new OrganizationType(id, name);
  }
}
