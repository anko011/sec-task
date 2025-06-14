import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';
import { Task, TaskDangerStatus, TaskPackage } from '../../entities';
import { UpdateTaskPackageCommand } from './update-task-package.command';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Role, User } from '~/users/application/entities';
import { EmailNotificationService } from '~/tasks/infrastructure/email-notification.service';
import { NotificationScheduler } from '~/tasks/infrastructure/notification.scheduler';

@CommandHandler(UpdateTaskPackageCommand)
export class UpdateTaskPackageCommandHandler
  implements ICommandHandler<UpdateTaskPackageCommand>
{
  private readonly logger = new Logger(UpdateTaskPackageCommandHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
    private readonly entityManager: EntityManager,
    private readonly emailService: EmailNotificationService,
    private readonly scheduleService: NotificationScheduler,
  ) {}

  public async execute({
    packageId,
    dto,
  }: UpdateTaskPackageCommand): Promise<TaskPackage> {
    const taskPackage = await this.getTaskPackage(packageId);

    const newOrganizations =
      dto.assignedOrganizationIds?.filter(
        (id) => !taskPackage.organizations.getIdentifiers().includes(id),
      ) ?? [];

    const createdTasks: Task[] = [];
    taskPackage.addOnAddTask((task) => createdTasks.push(task));

    const tasksChangedStatus: { task: Task; oldStatus: TaskDangerStatus }[] =
      [];
    for (const task of taskPackage.tasks) {
      task.addOnDangerStatusIncreased(async (task, oldStatus) => {
        tasksChangedStatus.push({ task, oldStatus });
      });
    }
    taskPackage.update(dto);
    await this.entityManager.persistAndFlush(taskPackage);

    const operatorsAndSupervisors = await this.usersRepository.find({
      role: [Role.Operator, Role.Supervisor],
    });

    operatorsAndSupervisors.forEach((operatorOrSupervisor) => {
      void this.scheduleService.schedulePackageNotifications(
        taskPackage,
        operatorOrSupervisor,
      );
    });

    for (const organization of await taskPackage.organizations.loadItems({
      populate: ['users.id'],
    })) {
      const isNew = newOrganizations.includes(organization.id);

      for (const user of organization.users) {
        if (isNew) {
          void this.emailService.sendNewTaskPackageNotification(
            taskPackage,
            user,
          );
        }

        for (const { task, oldStatus } of tasksChangedStatus) {
          void this.emailService.sendTaskDeadlineChangedNotification(
            task,
            user,
            oldStatus,
          );
        }

        for (const task of createdTasks) {
          void this.emailService.sendNewTaskNotification(task, user);
        }

        for (const task of taskPackage.tasks) {
          void this.scheduleService.scheduleTaskNotifications(task, user);
        }
      }
    }

    const loaded = await taskPackage.init({
      refresh: true,
      populate: ['attachments.filename'],
    });

    if (!loaded)
      throw new InternalServerErrorException(
        'Failed to initialize task package',
      );

    await this.cleanupOrphanedFiles(loaded);

    return loaded;
  }

  private async getTaskPackage(packageId: string): Promise<TaskPackage> {
    const taskPackage = await this.taskPackagesRepository.findOne(
      { id: packageId },
      {
        populate: [
          'organizations.users',
          'tasks',
          'attachments.filename',
          'tasks.executions.organization.id',
        ],
      },
    );

    if (!taskPackage)
      throw new NotFoundException(
        `Task package with id ${packageId} not found`,
      );

    return taskPackage;
  }

  private async cleanupOrphanedFiles(taskPackage: TaskPackage): Promise<void> {
    const uploadDir = path.join(process.cwd(), 'uploads', taskPackage.id);
    let shouldCheckForEmptyDir = false;

    try {
      try {
        await fs.promises.access(uploadDir, fs.constants.F_OK);
      } catch {
        this.logger.log(
          `Directory ${uploadDir} does not exist, skipping cleanup`,
        );
        return;
      }

      let filesInDir: string[];
      try {
        filesInDir = await fs.promises.readdir(uploadDir);
      } catch (err) {
        this.logger.error(`Error reading directory ${uploadDir}:`, err);
        return;
      }

      const attachments = taskPackage.attachments;
      const attachmentFiles = attachments.map(
        (attachment) => attachment.filename,
      );

      const filesToDelete = filesInDir.filter(
        (file) => !attachmentFiles.includes(file),
      );

      if (filesToDelete.length > 0) {
        shouldCheckForEmptyDir = true;
        for (const file of filesToDelete) {
          const filePath = path.join(uploadDir, file);
          try {
            await fs.promises.unlink(filePath);
            this.logger.log(`Deleted orphaned file: ${filePath}`);
          } catch (err) {
            this.logger.error(`Failed to delete file ${filePath}:`, err);
          }
        }
      }

      if (shouldCheckForEmptyDir) {
        try {
          const remainingFiles = await fs.promises.readdir(uploadDir);
          if (remainingFiles.length === 0) {
            await fs.promises.rmdir(uploadDir);
            this.logger.log(`Deleted empty directory: ${uploadDir}`);
          }
        } catch (err) {
          this.logger.error(
            `Error checking/removing directory ${uploadDir}:`,
            err,
          );
        }
      }
    } catch (err) {
      this.logger.error(
        `Unexpected error cleaning files for package ${taskPackage.id}:`,
        err,
      );
    }
  }
}
