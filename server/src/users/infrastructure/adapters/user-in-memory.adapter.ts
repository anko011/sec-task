import { EntityInMemoryAdapter } from '../../../common/adapters';
import { Role, User } from '../../application/entities';
import {
  UserFilterCriteria,
  UsersPort,
} from '../../application/ports/users.port';

export class UsersInMemoryAdapter
  extends EntityInMemoryAdapter<User, UserFilterCriteria>
  implements UsersPort
{
  constructor() {
    super();
    this.entities.push(
      ...[
        new User(
          '1',
          'Андрей',
          'Морозов',
          'Иванович',
          'admin@mail.ru',
          Role.Admin,
          '$2b$10$kFfvOnk7ZnoNYdYXRzMNP.I0IBQnHXX2NgkaDZ2CrjYsA95mk71cG',
          '1',
        ),
        new User(
          '2',
          'Иван',
          'Морозов',
          'Иванович',
          'operator@mail.ru',
          Role.Operator,
          '$2b$10$IH0DPvzFwDdLswHJAbRaS.f4Xt5f33jJYHlJXx2z62nGYqnkx5pYi',
          '1',
        ),
        new User(
          '3',
          'Илья',
          'Морозов',
          'Иванович',
          'assigner@mail.ru',
          Role.Assigner,
          '$2b$10$jAHOzQWDZireCnKFxs0VOuR8bF0qSf9DUrZLrfrDXjrb.3e/KmNuW',
          '2',
        ),
      ],
    );
  }
}
