import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOrganizationTypeCommand } from './delete-organization-type.command';
import { NotFoundException } from '@nestjs/common';
import { OrganizationTypesPort } from '../../ports';

@CommandHandler(DeleteOrganizationTypeCommand)
export class DeleteOrganizationCommandHandler
  implements ICommandHandler<DeleteOrganizationTypeCommand>
{
  public constructor(
    private readonly organizationTypesPort: OrganizationTypesPort,
  ) {}

  public async execute({ id }: DeleteOrganizationTypeCommand): Promise<void> {
    const organizationTypes = await this.organizationTypesPort.find({ id });

    if (!organizationTypes || organizationTypes.length !== 1)
      throw new NotFoundException(`TaskPackage ${id} not found`);

    await this.organizationTypesPort.delete(organizationTypes[0]);
  }
}
