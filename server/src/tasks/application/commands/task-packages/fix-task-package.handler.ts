import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FixTaskPackageCommand } from '~/tasks/application/commands/task-packages/fix-task-package.command';
import { InjectRepository } from '@mikro-orm/nestjs';
import { TaskPackage } from '~/tasks/application/entities';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@CommandHandler(FixTaskPackageCommand)
export class FixTaskPackageCommandHandler
  implements ICommandHandler<FixTaskPackageCommand>
{
  constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackageRepository: EntityRepository<TaskPackage>,
    private readonly entityManager: EntityManager,
  ) {}

  async execute({ id }: FixTaskPackageCommand): Promise<any> {
    const taskPackage = await this.taskPackageRepository.findOne(
      { id },
      { populate: ['tasks.executions.lastStatus'] },
    );

    if (!taskPackage)
      throw new NotFoundException(`TaskPackage with id ${id} not found`);

    const isSuccess = taskPackage.fix();
    if (!isSuccess)
      throw new BadRequestException(`TaskPackage have no finished tasks`);

    await this.entityManager.persistAndFlush(taskPackage);
  }
}
