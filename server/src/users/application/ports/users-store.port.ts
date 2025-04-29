import { Role, User } from '../entities';

export abstract class UsersStorePort {
  abstract findAndCount(
    where?: {
      readonly firstName?: string;
      readonly secondName?: string;
      readonly patronymic?: string;
      readonly email?: string;
      readonly role?: Role;
      readonly password?: string;
    },
    options?: { limit?: number; offset?: number },
  ): [User[], number] | PromiseLike<[User[], number]>;

  abstract save(user: User): Promise<User>;

  abstract find(where?: {
    id?: string;
    firstName?: string;
    secondName?: string;
    patronymic?: string;
    email?: string;
    role?: Role;
  }): Promise<User[]>;

  abstract findOne(where?: {
    id?: string;
    firstName?: string;
    secondName?: string;
    patronymic?: string;
    email?: string;
    role?: Role;
  }): Promise<User | null>;
}
