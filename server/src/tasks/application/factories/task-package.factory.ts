import { Injectable } from '@nestjs/common';
import { TaskPackage, TaskPackageStatus } from '../entities/task-package';

@Injectable()
export class TaskPackageFactory {
  public create(dto: {
    id: string;
    name: string;
    baseDocument: string;
    status?: TaskPackageStatus;
  }): TaskPackage {
    return new TaskPackage(dto.id, dto.name, dto.baseDocument, dto.status);
  }
}
