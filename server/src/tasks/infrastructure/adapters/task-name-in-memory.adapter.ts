import { EntityInMemoryAdapter } from '../../../common/adapters';
import { TaskName, TaskNameFilterCriteria } from '../../application/entities';
import { TaskNamesPort } from '../../application/ports';

export class TaskNameInMemoryAdapter
  extends EntityInMemoryAdapter<TaskName, TaskNameFilterCriteria>
  implements TaskNamesPort {}
