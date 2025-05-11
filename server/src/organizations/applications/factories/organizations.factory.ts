import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Organization, OrganizationType } from '../entities';

@Injectable()
export class OrganizationsFactory {
  create({
    name,
    type,
    isArchived = false,
  }: {
    name: string;
    type: OrganizationType;
    isArchived?: boolean;
  }): Organization {
    const id = uuidv4();
    return new Organization(id, type, name, isArchived);
  }
}
