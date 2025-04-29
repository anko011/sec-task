import { TaskPackage } from '../../application/entities';
import { Action, AppAbility } from '../../../ability/application/factories';
import { IPolicyHandler } from '../../../ability/infrastructure/police.handler';

export class ReadTaskPackagePolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, TaskPackage);
  }
}

export class CreateTaskPackagePolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Create, TaskPackage);
  }
}

export class UpdateTaskPackagePolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Update, TaskPackage);
  }
}

export class DeleteTaskPackagePolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Delete, TaskPackage);
  }
}
