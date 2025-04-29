import { Role, User } from 'src/users/application/entities';
import { Injectable } from '@nestjs/common';
import { UsersStorePort } from '../../../application/ports';

type UserFilterCriteria = {
  id?: string;
  firstName?: string;
  secondName?: string;
  patronymic?: string;
  email?: string;
  role?: Role;
};

type PaginationOptions = {
  limit?: number;
  offset?: number;
};

@Injectable()
export class InMemoryUsersAdapter implements UsersStorePort {
  private readonly users: User[] = [
    new User(
      '1',
      'AdminFN',
      'AdminSN',
      'AdminPN',
      'admin@mail.ru',
      Role.Admin,
      '$2b$10$okx/10di1JJ0cr7gSfH5LOg2XsHbBi68BAdIuSHrnvKbKXJzuZXEG',
    ),
    new User(
      '2',
      'AssignerFN',
      'AssignerSN',
      'AssignerPN',
      'assigner@mail.ru',
      Role.Assigner,
      '$2b$10$ddActiRL42edWPkwwoLFJ.vHDr523qJPI8hsN0Tp0WODLoQOFKvJC',
    ),
  ];

  async find(where?: UserFilterCriteria): Promise<User[]> {
    return this.applyFilters(this.users, where);
  }

  async findOne(where?: {
    id?: string;
    firstName?: string;
    secondName?: string;
    patronymic?: string;
    email?: string;
    role?: Role;
  }): Promise<User | null> {
    const user = (await this.find(where)).at(0);
    return user ?? null;
  }

  public async save(params: Omit<User, 'id'> & { id: string }): Promise<User> {
    const findIndex = this.users.findIndex((user) => user.id === params.id);

    if (findIndex > -1) {
      this.users[findIndex] = Object.assign(this.users[findIndex], params);
      return this.users[findIndex];
    }

    const user = this.createTaskInstance(
      params.id,
      params.firstName,
      params.secondName,
      params.patronymic,
      params.email,
      params.role,
      params.password,
    );

    this.users.push(user);

    return user;
  }

  public async findAndCount(
    filter?: UserFilterCriteria,
    pagination?: PaginationOptions,
  ): Promise<[User[], number]> {
    const filteredUsers = this.applyFilters(this.users, filter);
    const paginatedUsers = this.applyPagination(filteredUsers, pagination);

    return [paginatedUsers, filteredUsers.length];
  }

  private applyFilters(users: User[], filter?: UserFilterCriteria): User[] {
    if (!filter) return [...users];

    return users.filter((taskPackage) => {
      return (
        (!filter.firstName ||
          taskPackage.firstName.includes(filter.firstName)) &&
        (!filter.secondName ||
          taskPackage.secondName.includes(filter.secondName)) &&
        (!filter.patronymic ||
          taskPackage.patronymic.includes(filter.patronymic)) &&
        (!filter.email || taskPackage.email.includes(filter.email)) &&
        (!filter.role || taskPackage.role === filter.role) &&
        (!filter.id || taskPackage.id === filter.id)
      );
    });
  }

  private applyPagination(
    users: User[],
    pagination?: PaginationOptions,
  ): User[] {
    const limit = pagination?.limit ?? 10;
    const offset = pagination?.offset ?? 0;

    return users.slice(offset, offset + limit);
  }

  private createTaskInstance(
    id: string,
    firstName: string,
    secondName: string,
    patronymic: string,
    email: string,
    role: Role,
    password: string,
  ): User {
    return new User(
      id,
      firstName,
      secondName,
      patronymic,
      email,
      role,
      password,
    );
  }
}
