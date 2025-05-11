import { Task } from '../../application/entities';
import { Action } from '../../../ability/application/factories';
import { createSubjectPolices } from '../../../ability/infrastructure';

export const [
  ReadTaskPolicy,
  CreateTaskPolicy,
  UpdateTaskPolicy,
  DeleteTaskPolicy,
] = createSubjectPolices(
  [Action.Read, Action.Create, Action.Update, Action.Delete],
  Task,
);
