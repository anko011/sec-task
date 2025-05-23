import { TaskPackage } from '../../application/entities';
import { Action } from '../../../ability/application/factories';
import { createSubjectPolices } from '../../../ability/infrastructure';

export const [
  ReadTaskPackagePolicy,
  CreateTaskPackagePolicy,
  UpdateTaskPackagePolicy,
  DeleteTaskPackagePolicy,
  FixTaskPackagePolicy,
] = createSubjectPolices(
  [Action.Read, Action.Create, Action.Update, Action.Delete, Action.Fix],
  TaskPackage,
);
