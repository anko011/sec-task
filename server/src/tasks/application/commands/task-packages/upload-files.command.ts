import { ICommand } from '@nestjs/cqrs';

export class UploadFilesCommand implements ICommand {
  constructor(
    readonly id: string,
    readonly files: Express.Multer.File[],
  ) {}
}
