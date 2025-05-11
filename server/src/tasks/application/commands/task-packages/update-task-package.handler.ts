import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';

import { TaskCategoriesPort, TaskPackagesPort } from '../../ports';
import { TaskPackage } from '../../entities';

import { UpdateTaskPackageCommand } from './update-task-package.command';
import { OrganizationsPort } from '../../../../organizations/applications/ports';

@CommandHandler(UpdateTaskPackageCommand)
export class UpdateTaskPackageCommandHandler
  implements ICommandHandler<UpdateTaskPackageCommand>
{
  public constructor(
    private readonly taskPackagesPort: TaskPackagesPort,
    private readonly taskCategoriesPort: TaskCategoriesPort,
    private readonly organizationsPort: OrganizationsPort,
  ) {}

  public async execute({
    dto,
  }: UpdateTaskPackageCommand): Promise<TaskPackage> {
    const taskPackages = await this.taskPackagesPort.find({ id: dto.id });

    if (taskPackages.length !== 1)
      throw new BadRequestException(`Task package with id ${dto.id} not found`);

    const taskPackage = taskPackages[0];

    if (dto.assignedOrganizationIds) {
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
    }

    taskPackage.update(dto);

    await this.taskPackagesPort.save(taskPackage);
    return taskPackage;
  }
}
