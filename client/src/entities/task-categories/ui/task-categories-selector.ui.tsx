import { GenericAsyncSelector } from '~/shared/ui/generic-async-selector';

import { GetPaginatedTaskCategoriesContract } from '../api/contracts';
import type { TaskCategory } from '../model/task-category';

export type TaskCategoriesSelectorProps = {
    name?: string;
    defaultValue?: string;
    onChange?: (type: TaskCategory | undefined) => void;
};

export function TaskCategoriesSelector(props: TaskCategoriesSelectorProps) {
    return (
        <GenericAsyncSelector
            endpoint="/task-categories"
            parse={(data) => GetPaginatedTaskCategoriesContract.parse(data)}
            displayField="title"
            queryParam="title"
            placeholder="Введите название категории"
            {...props}
        />
    );
}
