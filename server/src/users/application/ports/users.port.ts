import { User } from '../entities';
import { BaseEntityPort } from '../../../common/ports';

export type UserFilterCriteria = Partial<Omit<User, 'password'>>;

export abstract class UsersPort extends BaseEntityPort<
  User,
  UserFilterCriteria
> {}
