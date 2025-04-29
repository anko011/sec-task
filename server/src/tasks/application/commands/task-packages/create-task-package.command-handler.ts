import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';

import { CreateTaskPackageCommand } from './create-task-package.command';
import { TaskPackagesPort } from '../../ports';
import { TaskPackage } from '../../entities/task-package';
import { TaskPackageFactory } from '../../factories';

@CommandHandler(CreateTaskPackageCommand)
export class CreateTaskPackageCommandHandler
  implements ICommandHandler<CreateTaskPackageCommand>
{
  public constructor(
    private readonly taskPackagesRepository: TaskPackagesPort,
    private readonly taskPackagesFactory: TaskPackageFactory,
  ) {}

  public async execute({
    dto,
  }: CreateTaskPackageCommand): Promise<TaskPackage> {
    const id = uuidv4();
    const taskPackage = this.taskPackagesFactory.create({ id, ...dto });
    return await this.taskPackagesRepository.save(taskPackage);
  }
}
