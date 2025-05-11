import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  OrganizationFilterCriteria,
  OrganizationsPort,
  OrganizationTypesPort,
} from '../../ports';
import { Organization } from '../../entities';

import { UpdateOrganizationCommand } from './update-organization.command';

@CommandHandler(UpdateOrganizationCommand)
export class UpdateOrganizationCommandHandler
  implements ICommandHandler<UpdateOrganizationCommand>
{
  public constructor(
    private readonly organizationsPort: OrganizationsPort,
    private readonly organizationTypesPort: OrganizationTypesPort,
  ) {}

  public async execute({
    dto,
  }: UpdateOrganizationCommand): Promise<Organization> {
    const organizations = await this.organizationsPort.find({
      id: dto.id,
    });

    if (organizations.length !== 1)
      throw new NotFoundException(`Organization with id ${dto.id} not found`);

    const organization = organizations[0];

    const opt: OrganizationFilterCriteria = { ...dto };
    if (dto.typeId) {
      const types = await this.organizationTypesPort.find({ id: dto.typeId });
      if (types.length !== 1)
        throw new BadRequestException(
          `Organization type with ${dto.typeId} not found.`,
        );

      opt.type = types[0];
    }

    organization.name = opt.name ?? organization.name;
    organization.type = opt.type ?? organization.type;
    organization.isArchived = opt.isArchived ?? organization.isArchived;

    return await this.organizationsPort.save(organization);
  }
}
