import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TaskCategory } from '../entities';

export type CreateTaskCategoryDTO = {
  name: string;
  color: string;
};

@Injectable()
export class TaskCategoryFactory {
  public create(dto: CreateTaskCategoryDTO): TaskCategory {
    const id = uuidv4();
    return new TaskCategory(id, dto.name, dto.color);
  }
}
