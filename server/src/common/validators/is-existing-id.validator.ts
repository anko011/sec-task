import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Global, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/better-sqlite';

@Global()
@ValidatorConstraint({ name: 'IsExistingId', async: true })
@Injectable()
export class IsExistingIdConstraint implements ValidatorConstraintInterface {
  constructor(private readonly em: EntityManager) {}

  async validate(value: any, args: ValidationArguments) {
    if (!value) return true;

    const [entityClass] = args.constraints;
    console.log(this.em);
    const entity = await this.em.findOne(entityClass, value);

    return !!entity;
  }

  defaultMessage(args: ValidationArguments) {
    const [entityClass] = args.constraints;
    return `${entityClass.name} with id ${args.value} not found`;
  }
}

export function IsExistingId(
  entityClass: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityClass],
      validator: IsExistingIdConstraint,
    });
  };
}
