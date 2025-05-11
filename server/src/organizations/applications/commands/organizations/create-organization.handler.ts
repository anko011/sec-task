import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { OrganizationsPort, OrganizationTypesPort } from '../../ports';
import { Organization } from '../../entities';
import { OrganizationsFactory } from '../../factories';

import { CreateOrganizationCommand } from './create-organization.command';

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationCommandHandler
  implements ICommandHandler<CreateOrganizationCommand>
{
  constructor(
    private readonly organizationsPort: OrganizationsPort,
    private readonly organizationsFactory: OrganizationsFactory,
    private readonly organizationTypesPort: OrganizationTypesPort,
  ) {}

  async execute({ dto }: CreateOrganizationCommand): Promise<Organization> {
    const types = await this.organizationTypesPort.find({ id: dto.typeId });

    if (types.length !== 1)
      throw new BadRequestException(
        `Organization type with id ${dto.typeId} doesn't exist`,
      );

    return await this.organizationsPort.save(
      this.organizationsFactory.create({ ...dto, type: types[0] }),
    );
  }
}
