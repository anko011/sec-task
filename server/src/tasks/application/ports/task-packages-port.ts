import { TaskPackage, TaskPackageStatus } from '../entities/task-package';
import { BaseEntityPort } from '../../../common/ports';

export type TaskPackageFilterCriteria = {
  readonly id?: string;
  readonly incomingRequisite?: string;
  readonly outgoingRequisite?: string;
  readonly status?: TaskPackageStatus;
};

export abstract class TaskPackagesPort extends BaseEntityPort<
  TaskPackage,
  TaskPackageFilterCriteria
> {}
