import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseBooleanPipe
  implements PipeTransform<string, boolean | undefined>
{
  transform(value: string | boolean) {
    if (typeof value === 'boolean') return value;

    if (value === undefined || value === null) {
      return undefined;
    }

    value = value.toLowerCase();

    if (value === 'true' || value === 'on' || value === '1') {
      return true;
    }

    if (value === 'false' || value === 'off' || value === '0') {
      return false;
    }

    throw new BadRequestException(
      'Validation failed (boolean string is expected)',
    );
  }
}
