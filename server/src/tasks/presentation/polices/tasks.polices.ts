import { Task } from '../../application/entities';
import { Action, AppAbility } from '../../../ability/application/factories';
import { IPolicyHandler } from '../../../ability/infrastructure/police.handler';

export class ReadTaskPolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, Task);
  }
}

export class CreateTaskPolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Create, Task);
  }
}

export class UpdateTaskPolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Update, Task);
  }
}

export class DeleteTaskPolicy implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Delete, Task);
  }
}
