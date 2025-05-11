import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';

import { OrganizationsPort } from '../../../../organizations/applications/ports';

import { TaskPackage } from '../../entities/task-package';
import { TaskPackageFactory } from '../../factories';
import { TaskPackagesPort } from '../../ports';

import { CreateTaskPackageCommand } from './create-task-package.command';

@CommandHandler(CreateTaskPackageCommand)
export class CreateTaskPackageCommandHandler
  implements ICommandHandler<CreateTaskPackageCommand>
{
  public constructor(
    private readonly taskPackagesPort: TaskPackagesPort,
    private readonly taskPackagesFactory: TaskPackageFactory,
    private readonly organizationsPort: OrganizationsPort,
  ) {}

  public async execute({
    dto,
  }: CreateTaskPackageCommand): Promise<TaskPackage> {
    const existingOrganizationIds = (
      await this.organizationsPort.find({
        id: { $in: dto.assignedOrganizationIds },
      })
    ).map(({ id }) => id);

    const nonExistingOrganizationIds = dto.assignedOrganizationIds.filter(
      (id) => !existingOrganizationIds.includes(id),
    );

    if (nonExistingOrganizationIds.length > 0)
      throw new BadRequestException(
        `Organizations with id ${nonExistingOrganizationIds.join(', ')} are not exists`,
      );

    const taskPackage = this.taskPackagesFactory.create(dto);
    return await this.taskPackagesPort.save(taskPackage);
  }
}
