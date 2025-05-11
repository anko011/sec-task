import { Injectable } from '@nestjs/common';
import { Role, User } from '../../../users/application/entities';
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Task, TaskPackage } from '../../../tasks/application/entities';
import { OrganizationType } from '../../../organizations/applications/entities';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects =
  | InferSubjects<typeof User>
  | typeof TaskPackage
  | typeof Task
  | typeof OrganizationType
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    can(Action.Read, 'all');

    if (user.role === Role.Admin) {
      can(Action.Manage, 'all');
    }

    if (user.role === Role.Assigner) {
      can(Action.Update, Task);
    }

    if (user.role === Role.Operator) {
      can(Action.Manage, Task);
      can(Action.Manage, TaskPackage);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
