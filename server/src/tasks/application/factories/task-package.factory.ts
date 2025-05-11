import { Injectable } from '@nestjs/common';
import { TaskPackage, TaskPackageStatus } from '../entities/task-package';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TaskPackageFactory {
  public create(dto: {
    incomingRequisite: string;
    outgoingRequisite: string;
    status?: TaskPackageStatus;
    assignedOrganizationIds: string[];
    createdAt?: Date;
  }): TaskPackage {
    const id = uuidv4();
    return new TaskPackage(
      id,
      dto.incomingRequisite,
      dto.outgoingRequisite,
      dto.status ?? TaskPackageStatus.ACTIVE,
      dto.assignedOrganizationIds,
      dto.createdAt ?? new Date(),
    );
  }
}
