import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from '@mikro-orm/better-sqlite';

import { TaskPackage } from '../../entities';

import { CreateTaskPackageCommand } from './create-task-package.command';

@CommandHandler(CreateTaskPackageCommand)
export class CreateTaskPackageCommandHandler
  implements ICommandHandler<CreateTaskPackageCommand>
{
  public constructor(private readonly entityManager: EntityManager) {}

  public async execute({
    dto,
  }: CreateTaskPackageCommand): Promise<TaskPackage> {
    const taskPackage = TaskPackage.createFromDto(dto);

    try {
      await this.entityManager.persistAndFlush(taskPackage);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return (await taskPackage.init({ refresh: true })) as TaskPackage;
  }
}
