import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

import { deepCleanObject } from '~/common/utils';

import { TaskName } from '../../entities';

import { UpdateTaskNameCommand } from './update-task-name.command';

@CommandHandler(UpdateTaskNameCommand)
export class UpdateTaskNameCommandHandler
  implements ICommandHandler<UpdateTaskNameCommand>
{
  public constructor(
    @InjectRepository(TaskName)
    private readonly taskNamesRepository: EntityRepository<TaskName>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({ id, dto }: UpdateTaskNameCommand): Promise<TaskName> {
    const taskName = await this.taskNamesRepository.findOne({
      id,
    });

    if (!taskName)
      throw new BadRequestException(`Task name with id ${id} not found`);

    const updatedTaskName = this.taskNamesRepository.assign(
      taskName,
      deepCleanObject(dto),
    );

    await this.entityManager.persistAndFlush(updatedTaskName);

    return updatedTaskName;
  }
}
