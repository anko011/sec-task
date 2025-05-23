import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';

import { Attachment, TaskPackage } from '../../entities';
import { UploadFilesCommand } from './upload-files.command';
import { InjectRepository } from '@mikro-orm/nestjs';

@CommandHandler(UploadFilesCommand)
export class UploadFilesCommandHandler
  implements ICommandHandler<UploadFilesCommand>
{
  public constructor(
    @InjectRepository(TaskPackage)
    private readonly taskPackagesRepository: EntityRepository<TaskPackage>,
    private readonly entityManager: EntityManager,
  ) {}

  public async execute({
    id,
    files,
  }: UploadFilesCommand): Promise<TaskPackage> {
    const taskPackage = await this.taskPackagesRepository.findOne(id, {
      populate: ['tasks:ref', 'attachments', 'organizations:ref'],
    });

    if (!taskPackage)
      throw new NotFoundException(`Task package with ${id} not found`);

    files.forEach((file) => {
      taskPackage.attachments.add(
        new Attachment(
          file.originalname,
          file.path,
          file.mimetype,
          taskPackage,
        ),
      );
    });

    try {
      await this.entityManager.persistAndFlush(taskPackage);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return (await taskPackage.init({ refresh: true })) as TaskPackage;
  }
}
