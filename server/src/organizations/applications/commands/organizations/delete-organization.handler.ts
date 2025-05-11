import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOrganizationCommand } from './delete-organization.command';
import { NotFoundException } from '@nestjs/common';
import { OrganizationsPort } from '../../ports';

@CommandHandler(DeleteOrganizationCommand)
export class DeleteOrganizationCommandHandler
  implements ICommandHandler<DeleteOrganizationCommand>
{
  public constructor(private readonly organizationsPort: OrganizationsPort) {}

  public async execute({ id }: DeleteOrganizationCommand): Promise<void> {
    const organizations = await this.organizationsPort.find({ id });

    if (organizations.length !== 1)
      throw new NotFoundException(`Organization with ${id} not found`);

    await this.organizationsPort.delete(organizations[0]);
  }
}
