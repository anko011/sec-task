import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

import { TaskPackage } from '../../entities';

import { CreateTaskPackageCommand } from './create-task-package.command';
import { NotificationScheduler } from '~/tasks/infrastructure/notification.scheduler';
import { EmailNotificationService } from '~/tasks/infrastructure/email-notification.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Role, User } from '~/users/application/entities';

@CommandHandler(CreateTaskPackageCommand)
export class CreateTaskPackageCommandHandler
  implements ICommandHandler<CreateTaskPackageCommand>
{
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly entityManager: EntityManager,
    private readonly notificationScheduler: NotificationScheduler,
    private readonly emailNotificationService: EmailNotificationService,
  ) {}

  public async execute({
    dto,
  }: CreateTaskPackageCommand): Promise<TaskPackage> {
    const taskPackage = TaskPackage.createFromDto(dto);

    if (!taskPackage)
      throw new InternalServerErrorException('Cannot create task package');

    try {
      await this.entityManager.persistAndFlush(taskPackage);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    const operatorsAndSupervisors = await this.usersRepository.find({
      role: [Role.Operator, Role.Supervisor],
    });

    operatorsAndSupervisors.forEach((operatorOrSupervisor) => {
      void this.notificationScheduler.schedulePackageNotifications(
        taskPackage,
        operatorOrSupervisor,
      );
    });

    await taskPackage.init({
      populate: ['organizations.users'],
    });

    for (const organization of taskPackage.organizations) {
      for (const user of organization.users) {
        void this.emailNotificationService.sendNewTaskPackageNotification(
          taskPackage,
          user,
        );

        for (const task of taskPackage.tasks) {
          void this.notificationScheduler.scheduleTaskNotifications(task, user);
        }
      }
    }

    return taskPackage;
  }
}
