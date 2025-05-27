import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Task, TaskDangerStatus } from '../application/entities/task';
import { User } from '~/users/application/entities/user';
import { TaskPackage } from '../application/entities/task-package';

@Injectable()
export class EmailNotificationService {
  private readonly logger = new Logger(EmailNotificationService.name);

  constructor(private readonly mailerService: MailerService) {}

  private async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ) {
    if (to === 'admin@mail.ru') return;
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
      this.logger.log(`Email sent to ${to} with subject "${subject}"`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
    }
  }

  async sendTaskDeadlineReminder(
    task: Task,
    user: User,
    daysLeft: number,
  ): Promise<void> {
    await this.sendEmail(
      user.email,
      `Напоминание: срок выполнения задачи истекает через ${daysLeft} дней`,
      './task-deadline-reminder',
      {
        taskPackageOutgoingRequisite: task.taskPackage.outgoingRequisite,
        taskName: task.name.title,
        taskNumber: task.number,
        deadline: task.deadline.toLocaleDateString(),
        daysLeft,
        userName: `${user.secondName} ${user.firstName}`,
      },
    );
  }

  async sendReportDeadlineReminder(
    taskPackage: TaskPackage,
    user: User,
    daysLeft: number,
  ): Promise<void> {
    await this.sendEmail(
      user.email,
      `Напоминание: срок сдачи отчета истекает через ${daysLeft} дней`,
      './report-deadline-reminder',
      {
        packageRequisite: taskPackage.incomingRequisite,
        deadline: taskPackage.reportDeadline.toLocaleDateString(),
        daysLeft,
        userName: `${user.secondName} ${user.firstName}`,
      },
    );
  }

  async sendNewTaskNotification(task: Task, user: User): Promise<void> {
    await this.sendEmail(
      user.email,
      'Новая задача назначена вашей организации',
      './new-task-notification',
      {
        taskPackageOutgoingRequisite: task.taskPackage.outgoingRequisite,
        taskName: task.name.title,
        taskNumber: task.number,
        deadline: task.deadline.toLocaleDateString(),
        dangerStatus: task.dangerStatus,
        userName: `${user.secondName} ${user.firstName}`,
      },
    );
  }

  async sendNewTaskPackageNotification(
    taskPackage: TaskPackage,
    user: User,
  ): Promise<void> {
    await this.sendEmail(
      user.email,
      'Новый пакет задач назначен вашей организации',
      './new-task-package-notification',
      {
        packageOutgoingRequisite: taskPackage.outgoingRequisite,
        userName: `${user.secondName} ${user.firstName}`,
      },
    );
  }

  async sendTaskDeadlineChangedNotification(
    task: Task,
    user: User,
    oldStatus: TaskDangerStatus,
  ): Promise<void> {
    await this.sendEmail(
      user.email,
      'Сокращен срок выполнения задачи',
      './task-deadline-changed',
      {
        taskPackageOutgoingRequisite: task.taskPackage.outgoingRequisite,
        taskNumber: task.number,
        oldStatus: this.getStatusName(oldStatus),
        newStatus: this.getStatusName(task.dangerStatus),
        newDeadline: task.deadline.toLocaleDateString(),
        userName: `${user.secondName} ${user.firstName}`,
      },
    );
  }

  private getStatusName(status: TaskDangerStatus): string {
    return {
      [TaskDangerStatus.LOW]: 'низкий',
      [TaskDangerStatus.MEDIUM]: 'средний',
      [TaskDangerStatus.HIGH]: 'высокий',
      [TaskDangerStatus.CRITICAL]: 'критический',
    }[status];
  }
}
