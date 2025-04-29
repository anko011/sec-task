import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Role, User } from '../entities';

type UserProperties = {
  readonly firstName: string;
  readonly secondName: string;
  readonly patronymic: string;
  readonly email: string;
  readonly role: Role;
  readonly password: string;
};

@Injectable()
export class UsersFactory {
  create(props: UserProperties): User {
    const id = uuidv4();
    return new User(
      id,
      props.firstName,
      props.secondName,
      props.patronymic,
      props.email,
      props.role,
      props.password,
    );
  }
}
