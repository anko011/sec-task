import { PaginationOptions } from '../queries';
import { QueryFilter } from '../ports/base-entity.port';

export abstract class EntityInMemoryAdapter<
  Entity extends { id: string },
  FilterCriteria,
> {
  protected readonly entities: Entity[] = [];

  async save(entity: Entity): Promise<Entity> {
    const findIndex = this.entities.findIndex((e) => e.id === entity.id);
    if (findIndex > -1) return entity;
    this.entities.push(entity);
    return entity;
  }

  async delete(entity: Entity): Promise<void> {
    const findIndex = this.entities.findIndex((e) => e.id === entity.id);
    if (findIndex === -1) return;
    this.entities.splice(findIndex, 1);
  }

  async find(
    where?: QueryFilter<FilterCriteria>,
    options?: PaginationOptions,
  ): Promise<Entity[]> {
    const filtered = this.applyFilters(where);
    return this.applyPagination(filtered, options);
  }

  async count(where?: FilterCriteria): Promise<number> {
    const filtered = this.applyFilters(where);
    return filtered.length;
  }

  protected applyFilters(where?: QueryFilter<FilterCriteria>): Entity[] {
    if (!where) return [...this.entities];

    return this.entities.filter((entity) => {
      return Object.entries(where).every(([key, filterValue]) => {
        if (filterValue === undefined || filterValue === null) return true;

        if (!(key in entity)) return true;

        const entityValue = entity[key as keyof Entity];

        if (key === 'id' && typeof filterValue !== 'object')
          return filterValue === entityValue;

        if (typeof filterValue === 'string') {
          return String(entityValue)
            .toLowerCase()
            .trim()
            .includes(filterValue.toLowerCase().trim());
        }

        if (typeof filterValue === 'object') {
          if (this.isInOperator(filterValue)) {
            return filterValue.$in.includes(entityValue);
          }

          if (this.isNeOperator(filterValue)) {
            return entityValue !== filterValue.$ne;
          }

          if (this.isComparisonOperator(filterValue)) {
            if (!this.isNumber(entityValue)) return false;

            let matches = true;

            if (filterValue.$gt !== undefined)
              matches = matches && entityValue > filterValue.$gt;

            if (filterValue.$lt !== undefined)
              matches = matches && entityValue < filterValue.$lt;

            return matches;
          }

          return JSON.stringify(entityValue) === JSON.stringify(filterValue);
        }

        return entityValue === filterValue;
      });
    });
  }

  private isNumber(value: unknown): value is number {
    return typeof value === 'number';
  }

  private isInOperator<T>(value: object): value is { $in: T[] } {
    return '$in' in value && Array.isArray(value.$in);
  }

  private isNeOperator<T>(value: object): value is { $ne: T } {
    return '$ne' in value;
  }

  private isComparisonOperator(
    value: object,
  ): value is { $gt?: number; $lt?: number } {
    const hasGt = '$gt' in value;
    const hasLt = '$lt' in value;

    if (!hasGt && !hasLt) return false;

    if (hasGt && typeof value.$gt !== 'number') return false;
    return !(hasLt && typeof value.$lt !== 'number');
  }

  private applyPagination(
    entities: Entity[],
    options?: PaginationOptions,
  ): Entity[] {
    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;

    return entities.slice(offset, offset + limit);
  }
}
