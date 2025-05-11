import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators, Type as NType } from '@nestjs/common';

export class PaginationModel<T> {
  @ApiProperty({ isArray: true })
  public readonly items: T[];

  @ApiProperty({ example: 100 })
  public readonly total: number;

  @ApiProperty({ example: 3 })
  public readonly offset: number;

  @ApiProperty({ example: 10 })
  public readonly limit: number;
}

export const ApiPaginatedResponse = <TModel extends NType<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PaginationModel, model),
    ApiQuery({ name: 'limit', type: Number, required: false, default: 10 }),
    ApiQuery({ name: 'offset', type: Number, required: false, default: 0 }),
    ApiOkResponse({
      description: 'Successfully received model list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationModel) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
