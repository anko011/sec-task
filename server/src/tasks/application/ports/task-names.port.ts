import { BaseEntityPort } from '../../../common/ports';
import { TaskName, TaskNameFilterCriteria } from '../entities';

export abstract class TaskNamesPort extends BaseEntityPort<
  TaskName,
  TaskNameFilterCriteria
> {}
