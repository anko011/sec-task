import { EntityInMemoryAdapter } from '../../../common/adapters';
import { TaskPackage } from '../../application/entities';
import {
  TaskPackageFilterCriteria,
  TaskPackagesPort,
} from '../../application/ports';

export class TaskPackageInMemoryAdapter
  extends EntityInMemoryAdapter<TaskPackage, TaskPackageFilterCriteria>
  implements TaskPackagesPort
{
  protected applyFilters(where?: TaskPackageFilterCriteria): TaskPackage[] {
    if (!where) return [...this.entities];

    return this.entities.filter((taskPackage) => {
      return (
        (!where.id || taskPackage.id === where.id) &&
        (!where.status || taskPackage.status === where.status) &&
        (!where.incomingRequisite ||
          taskPackage.incomingRequisite.includes(where.incomingRequisite)) &&
        (!where.outgoingRequisite ||
          taskPackage.outgoingRequisite.includes(where.outgoingRequisite))
      );
    });
  }
}
