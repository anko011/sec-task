import { Type } from '@nestjs/common';
import { Action, AppAbility } from '../application/factories';
import { IPolicyHandler } from './police.handler';

export function createSubjectPolices(actions: Action[], type: Type) {
  return actions.map(
    (action) =>
      class ReadPolice implements IPolicyHandler {
        handle(ability: AppAbility) {
          return ability.can(action, type);
        }
      },
  );
}
