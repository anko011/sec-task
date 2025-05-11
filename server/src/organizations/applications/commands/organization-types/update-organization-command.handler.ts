import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { OrganizationTypesPort } from '../../ports';
import { OrganizationType } from '../../entities';

import { UpdateOrganizationTypeCommand } from './update-organization-type.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateOrganizationTypeCommand)
export class UpdateOrganizationCommandHandler
  implements ICommandHandler<UpdateOrganizationTypeCommand>
{
  public constructor(
    private readonly organizationTypesPort: OrganizationTypesPort,
  ) {}

  public async execute({
    dto,
  }: UpdateOrganizationTypeCommand): Promise<OrganizationType> {
    const organizationTypes = await this.organizationTypesPort.find({
      id: dto.id,
    });

    if (organizationTypes.length !== 1)
      throw new NotFoundException(`Organization type ${dto.id} not found`);

    const organizationType = organizationTypes[0];
    organizationType.name = dto.name ?? organizationType.name;

    return await this.organizationTypesPort.save(organizationType);
  }
}
