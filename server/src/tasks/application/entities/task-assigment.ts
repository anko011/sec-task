import { Task } from './task';
import { Assignee } from './assignee';

export class TaskAssignment {
    public constructor(
        public readonly assignee: Assignee,
        public readonly task: Task,
        public status: string
    ) {}
}
