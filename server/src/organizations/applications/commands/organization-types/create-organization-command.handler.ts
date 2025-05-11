import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateOrganizationTypeCommand } from './create-organization-type.command';
import { OrganizationTypesPort } from '../../ports';
import { OrganizationType } from '../../entities';
import { OrganizationTypesFactory } from '../../factories';

@CommandHandler(CreateOrganizationTypeCommand)
export class CreateOrganizationCommandHandler
  implements ICommandHandler<CreateOrganizationTypeCommand>
{
  constructor(
    private readonly organizationTypesPort: OrganizationTypesPort,
    private readonly organizationTypesFactory: OrganizationTypesFactory,
  ) {}

  async execute({
    dto,
  }: CreateOrganizationTypeCommand): Promise<OrganizationType> {
    return await this.organizationTypesPort.save(
      this.organizationTypesFactory.create(dto),
    );
  }
}
