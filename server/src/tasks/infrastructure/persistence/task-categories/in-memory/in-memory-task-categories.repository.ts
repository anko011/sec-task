import { Injectable } from '@nestjs/common';
import { TaskCategoriesPort } from '../../../../application/ports';
import { TaskCategory } from '../../../../application/entities';

type TaskCategoryFilterCriteria = {
  name?: string;
  color?: string;
};

type PaginationOptions = {
  limit?: number;
  offset?: number;
};

@Injectable()
export class InMemoryTaskCategoriesRepository extends TaskCategoriesPort {
  private categories: TaskCategory[] = [
    this.createInstance('1', 'Category #1', 'blue'),
    this.createInstance('2', 'Category #2', 'red'),
    this.createInstance('3', 'Category #3', 'green'),
  ];

  public async save(
    params: Omit<TaskCategory, 'id'> & { id: string },
  ): Promise<TaskCategory> {
    const category = this.createInstance(params.id, params.name, params.color);
    this.categories.push(category);
    return category;
  }

  public async delete(id: string): Promise<void> {
    const initialLength = this.categories.length;
    this.categories = this.categories.filter((category) => category.id !== id);

    if (this.categories.length === initialLength) {
      throw new Error(`Task with ID ${id} not found`);
    }
  }

  public async update(params: {
    id: string;
    name?: string;
    color?: string;
  }): Promise<TaskCategory> {
    const category = await this.findOrFail(params.id);

    this.updateProperties(category, params);

    return category;
  }

  public async findAndCount(
    filter?: TaskCategoryFilterCriteria,
    pagination?: PaginationOptions,
  ): Promise<[TaskCategory[], number]> {
    const filteredTasks = this.applyFilters(this.categories, filter);
    const paginatedTasks = this.applyPagination(filteredTasks, pagination);

    return [paginatedTasks, filteredTasks.length];
  }

  public async find(id: string): Promise<TaskCategory | null> {
    return this.categories.find((task) => task.id === id) ?? null;
  }

  public async findOrFail(id: string): Promise<TaskCategory> {
    const task = await this.find(id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return task;
  }

  private createInstance(
    id: string,
    name: string,
    color: string,
  ): TaskCategory {
    return new TaskCategory(id, name, color);
  }

  private updateProperties(
    category: TaskCategory,
    updates: Partial<Omit<TaskCategory, 'id'>>,
  ): void {
    Object.assign(category, updates);
  }

  private applyFilters(
    categories: TaskCategory[],
    filter?: TaskCategoryFilterCriteria,
  ): TaskCategory[] {
    if (!filter) return [...categories];

    return categories.filter((category) => {
      return (
        (!filter.name || category.name.includes(filter.name)) &&
        (!filter.color || category.name.includes(filter.color))
      );
    });
  }

  private applyPagination(
    packages: TaskCategory[],
    pagination?: PaginationOptions,
  ): TaskCategory[] {
    const limit = pagination?.limit ?? 10;
    const offset = pagination?.offset ?? 0;

    return packages.slice(offset, offset + limit);
  }
}
