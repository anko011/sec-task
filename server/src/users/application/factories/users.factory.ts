import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities';

type UserProperties = Omit<User, 'id'>;

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
      props.organizationId,
    );
  }
}
