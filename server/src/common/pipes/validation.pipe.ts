import {
  BadRequestException,
  ValidationError,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';

export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = {};

        errors.forEach((error) => {
          if (error.constraints) {
            formattedErrors[error.property] = Object.values(
              error.constraints,
            )[0];
          } else if (error.children?.length) {
            formattedErrors[error.property] = this.formatNestedErrors(
              error.children,
            );
          } else {
            formattedErrors[error.property] = 'Invalid value';
          }
        });

        return new BadRequestException({ errors: formattedErrors });
      },
    });
  }

  private formatNestedErrors(children: ValidationError[]): string {
    const firstChild = children[0];
    if (firstChild.constraints) {
      return Object.values(firstChild.constraints)[0];
    } else if (firstChild.children?.length) {
      return this.formatNestedErrors(firstChild.children);
    }
    return 'Invalid nested object';
  }
}
