import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TaskName } from '../entities';

export type CreateTaskNameDTO = {
  name: string;
};

@Injectable()
export class TaskNameFactory {
  public create(dto: CreateTaskNameDTO): TaskName {
    const id = uuidv4();
    return new TaskName(id, dto.name);
  }
}
