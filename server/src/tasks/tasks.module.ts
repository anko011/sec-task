import { Logger, Module } from '@nestjs/common';

import { handlers as taskPackagesCommandHandlers } from './application/commands/task-packages';
import { handlers as taskPackagesQueryHandlers } from './application/queries/task-packages';

import { handlers as tasksQueryHandlers } from './application/queries/tasks';
import { handlers as tasksCommandsHandlers } from './application/commands/tasks';

import { handlers as taskCategoriesQueryHandlers } from './application/queries/task-categories';
import { handlers as taskCategoriesCommandHandlers } from './application/commands/task-categories';

import { handlers as taskNamesQueryHandlers } from './application/queries/task-names';
import { handlers as taskNamesCommandHandlers } from './application/commands/task-name';

import { handlers as organizationsQueryHandlers } from './application/queries/organizations';

import {
  TaskCategoriesController,
  TaskNamesController,
  TaskPackagesController,
  TasksController,
} from './presentation/controllers';

import { OrganizationsModule } from '../organizations/organizations.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  Attachment,
  Task,
  TaskCategory,
  TaskExecution,
  TaskName,
  TaskPackage,
} from '~/tasks/application/entities';
import { TaskStatusHistory } from '~/tasks/application/entities/task-status-history';
import { EntityManager, MikroORM } from '@mikro-orm/better-sqlite';
import * as path from 'node:path';
import * as fs from 'fs/promises';
import { JwtModule } from '@nestjs/jwt';
import { User } from '~/users/application/entities';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailNotificationService } from '~/tasks/infrastructure/email-notification.service';
import { NotificationScheduler } from '~/tasks/infrastructure/notification.scheduler';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    OrganizationsModule,
    JwtModule,
    ScheduleModule.forRoot(),
    MikroOrmModule.forFeature([
      Attachment,
      TaskPackage,
      Task,
      TaskCategory,
      TaskName,
      TaskExecution,
      TaskStatusHistory,
      User,
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: parseInt(config.get('SMTP_PORT') ?? '25'),
          secure: config.get('SMTP_SECURE') === 'true',
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"Task Management System" <${config.get('SMTP_FROM')}>`,
        },
        template: {
          dir: 'templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [
    ...taskPackagesQueryHandlers,
    ...taskPackagesCommandHandlers,
    ...tasksQueryHandlers,
    ...tasksCommandsHandlers,
    ...taskCategoriesQueryHandlers,
    ...taskCategoriesCommandHandlers,
    ...taskNamesQueryHandlers,
    ...taskNamesCommandHandlers,
    ...organizationsQueryHandlers,
    EmailNotificationService,
    NotificationScheduler,
  ],
  controllers: [
    TaskPackagesController,
    TasksController,
    TaskCategoriesController,
    TaskNamesController,
  ],
})
export class TasksModule {
  private readonly logger = new Logger(TasksModule.name);

  constructor(private readonly orm: MikroORM) {}

  async onApplicationBootstrap() {
    await this.orm.connect();

    const migrator = this.orm.getMigrator();
    const pendingMigrations = await migrator.getPendingMigrations();

    if (pendingMigrations.length > 0) return;

    await this.cleanupMissingAttachments(this.orm.em);
  }

  private async cleanupMissingAttachments(em: EntityManager): Promise<number> {
    const taskPackages = await em.findAll(TaskPackage, {
      populate: ['attachments'],
    });

    let deletedCount = 0;

    for (const taskPackage of taskPackages) {
      const uploadDir = path.join(process.cwd(), 'uploads', taskPackage.id);
      let existingFiles: string[] = [];

      try {
        existingFiles = await fs.readdir(uploadDir);
      } catch (err) {
        if (err instanceof Error) {
          if ('code' in err && err.code === 'ENOENT') {
            this.logger.debug(
              `Directory ${uploadDir} not found, checking attachments...`,
            );
          } else {
            this.logger.error(
              `Error accessing directory ${uploadDir}: ${err.message}`,
            );
            continue;
          }
        } else {
          this.logger.error(`Unknown error when accessing ${uploadDir}`, err);
          continue;
        }
      }

      for (const attachment of taskPackage.attachments) {
        try {
          if (!existingFiles.includes(attachment.filename)) {
            await em.removeAndFlush(attachment);
            deletedCount++;
            this.logger.log(
              `Deleted attachment ${attachment.id} (file ${attachment.filename} not found)`,
            );
          }
        } catch (dbError) {
          this.logger.error(
            `Failed to delete attachment ${attachment.id}: ${dbError.message}`,
          );
        }
      }
    }

    this.logger.log(
      `Cleanup completed. Total attachments deleted: ${deletedCount}`,
    );
    return deletedCount;
  }
}
