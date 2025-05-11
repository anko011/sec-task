import { PaginationOptions } from '../queries';

export type QueryFilter<T> = {
  [K in keyof T]: T[K] | { $in: Exclude<T[K], undefined>[] };
};

export abstract class BaseEntityPort<Entity, FilterCriteria> {
  abstract save(entity: Entity): Promise<Entity>;

  abstract find(
    where?: QueryFilter<FilterCriteria>,
    limit?: PaginationOptions,
  ): Promise<Entity[]>;

  abstract count(where?: FilterCriteria): Promise<number>;

  abstract delete(entity: Entity): Promise<void>;
}
