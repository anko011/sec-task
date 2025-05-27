import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteTaskPackageCommand } from './delete-task-package.command';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  EntityManager,
  EntityRepository,
  ForeignKeyConstraintViolationException,
} from '@mikro-orm/better-sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { TaskPackage } from '~/tasks/application/entities';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { NotificationScheduler } from '~/tasks/infrastructure/notification.scheduler';
import { Role, User } from '~/users/application/entities';

@CommandHandler(DeleteTaskPackageCommand)
export class DeleteTaskPackageCommandHandler
  implements ICommandHandler<DeleteTaskPackageCommand>
{
  public constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly entityManager: EntityManager,
    private readonly notificationScheduler: NotificationScheduler,
  ) {}

  public async execute({ id }: DeleteTaskPackageCommand): Promise<void> {
    const taskPackage = await this.taskPackagesRepository.findOne(
      {
        id,
      },
      { populate: ['organizations.users', 'tasks'] },
    );

    const operatorsAndSupervisors = await this.usersRepository.find({
      role: [Role.Operator, Role.Supervisor],
    });

    if (!taskPackage)
      throw new NotFoundException(`Task package with id ${id} not found`);

    try {
      operatorsAndSupervisors.forEach((operatorOrSupervisor) => {
        void this.notificationScheduler.cancelScheduledPackageNotification(
          taskPackage,
          operatorOrSupervisor,
        );
      });

      for (const organization of await taskPackage.organizations.loadItems()) {
        for (const user of await organization.users.loadItems()) {
          for (const task of taskPackage.tasks) {
            void this.notificationScheduler.cancelScheduledTaskNotification(
              task,
              user,
            );
          }
        }
      }

      await this.entityManager.removeAndFlush(taskPackage);
      await this.deleteTaskPackageFiles(id);
    } catch (e) {
      if (e instanceof ForeignKeyConstraintViolationException) {
        throw new ConflictException(
          `Cannot delete the task package with id ${id} because it is referenced by other entities.`,
        );
      }

      throw e;
    }
  }

  private async deleteTaskPackageFiles(id: string): Promise<void> {
    const taskPackageDir = path.join('uploads', id);

    try {
      if (
        await fs.promises
          .access(taskPackageDir)
          .then(() => true)
          .catch(() => false)
      ) {
        await fs.promises.rm(taskPackageDir, { recursive: true, force: true });
      }
    } catch (err) {
      console.error(`Failed to delete files for task package ${id}:`, err);
    }
  }
}
