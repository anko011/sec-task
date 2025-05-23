import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';
import { TaskPackage } from '../../entities';
import { UpdateTaskPackageCommand } from './update-task-package.command';
import * as path from 'node:path';
import * as fs from 'node:fs';

@CommandHandler(UpdateTaskPackageCommand)
export class UpdateTaskPackageCommandHandler
  implements ICommandHandler<UpdateTaskPackageCommand>
{
  private readonly logger = new Logger(UpdateTaskPackageCommandHandler.name);

  constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({
    packageId,
    dto,
  }: UpdateTaskPackageCommand): Promise<TaskPackage> {
    const taskPackage = await this.getTaskPackage(packageId);

    taskPackage.update(dto);
    await this.entityManager.persistAndFlush(taskPackage);

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
          'organizations:ref',
          'tasks',
          'attachments.filename',
          'tasks.executions.organization.id',
          'tasks.executions.id',
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
