import { createSubjectPolices } from '../../../ability/infrastructure';
import { Action } from '../../../ability/application/factories';
import { User } from '../../application/entities';

export const [
  ReadUserPolice,
  CreateUserPolice,
  UpdateUserPolice,
  DeleteUserPolice,
] = createSubjectPolices(
  [Action.Read, Action.Create, Action.Update, Action.Delete],
  User,
);
