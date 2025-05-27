import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { EntityRepository } from '@mikro-orm/better-sqlite';
import { EmailNotificationService } from './email-notification.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Task,
  TaskDangerStatus,
  TaskPackage,
  TaskPackageStatus,
} from '~/tasks/application/entities';
import { Role, User } from '~/users/application/entities';
import { addSeconds, subDays } from 'date-fns';

@Injectable()
export class NotificationScheduler implements OnModuleInit {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(
    private readonly emailNotificationService: EmailNotificationService,
    private readonly schedulerRegistry: SchedulerRegistry,
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
  ) {}

  async onModuleInit() {
    try {
      await this.scheduleAllNotifications();
    } catch (error) {
      this.logger.error('Ошибка при инициализации уведомлений', error);
    }
  }

  async scheduleAllNotifications() {
    const taskPackages = await this.taskPackagesRepository.find(
      {
        status: TaskPackageStatus.ACTIVE,
      },
      {
        populate: ['organizations.users', 'tasks'],
      },
    );

    const operatorsOrSupervisors = await this.usersRepository.find({
      role: [Role.Supervisor, Role.Assigner],
    });

    for (const taskPackage of taskPackages) {
      for (const operatorOrSupervisor of operatorsOrSupervisors) {
        void this.schedulePackageNotifications(
          taskPackage,
          operatorOrSupervisor,
        );
      }

      const tasks = await taskPackage.tasks.loadItems();

      for (const organization of taskPackage.organizations) {
        for (const user of await organization.users.loadItems()) {
          for (const task of tasks) {
            void this.scheduleTaskNotifications(task, user);
          }
        }
      }
    }
  }

  getPackageNotificationJobName(taskPackage: TaskPackage, user: User) {
    return `package-${taskPackage.id}-user-${user.id}-report`;
  }

  cancelScheduledPackageNotification(taskPackage: TaskPackage, user: User) {
    const jobName = this.getPackageNotificationJobName(taskPackage, user);
    this.removeScheduledJob(jobName);
  }

  async schedulePackageNotifications(taskPackage: TaskPackage, user: User) {
    this.cancelScheduledPackageNotification(taskPackage, user);
    const reminderDate = this.getDayBefore(taskPackage.reportDeadline);
    if (reminderDate <= new Date()) {
      await this.emailNotificationService.sendReportDeadlineReminder(
        taskPackage,
        user,
        1,
      );
      this.logger.log(`Отправлено напоминание о пакете ${taskPackage.id}`);
      return;
    }

    const job = new CronJob(reminderDate, async () => {
      try {
        await this.emailNotificationService.sendReportDeadlineReminder(
          taskPackage,
          user,
          1,
        );
        this.logger.log(`Отправлено напоминание о пакете ${taskPackage.id}`);
      } catch (err) {
        this.logger.error(
          `Ошибка при отправке напоминания по пакету ${taskPackage.id}`,
          err,
        );
      }
    });

    const jobName = this.getPackageNotificationJobName(taskPackage, user);
    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();

    this.logger.log(
      `A notification has been set for package ${taskPackage.id} on ${reminderDate} with job name ${jobName}`,
    );
  }

  getTaskNotificationJobName(task: Task, user: User) {
    return `task-${task.id}-user-${user.id}-deadline`;
  }

  cancelScheduledTaskNotification(task: Task, user: User) {
    const jobName = this.getTaskNotificationJobName(task, user);
    this.removeScheduledJob(jobName);
  }

  async scheduleTaskNotifications(task: Task, user: User) {
    this.cancelScheduledTaskNotification(task, user);
    const reminderDate = this.getDayBefore(task.deadline);
    if (reminderDate <= new Date()) {
      if (task.dangerStatus === TaskDangerStatus.CRITICAL) {
        await this.emailNotificationService.sendTaskDeadlineReminder(
          task,
          user,
          1,
        );
        this.logger.log(`Отправлено напоминание по задаче ${task.id}`);
      }

      return;
    }
    const job = new CronJob(reminderDate, async () => {
      try {
        await this.emailNotificationService.sendTaskDeadlineReminder(
          task,
          user,
          1,
        );
        this.logger.log(`Отправлено напоминание по задаче ${task.id}`);
      } catch (err) {
        this.logger.error(
          `Ошибка при отправке напоминания по задаче ${task.id}`,
          err,
        );
      }
    });

    const jobName = this.getTaskNotificationJobName(task, user);
    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
    this.logger.log(
      `A notification has been set for task ${task.id} on ${reminderDate} with job name ${jobName}`,
    );
  }

  private removeScheduledJob(name: string) {
    try {
      this.schedulerRegistry.deleteCronJob(name);
      this.logger.log(`Удалено старое задание: ${name}`);
    } catch {}
  }

  private getDayBefore(date: Date): Date {
    return addSeconds(subDays(date, 1), 5);
  }
}
