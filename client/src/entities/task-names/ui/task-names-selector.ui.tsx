import type { Select } from '@radix-ui/themes';

import { GenericAsyncSelector } from '~/shared/ui/generic-async-selector';

import type { TaskName } from '../model/task-name';
import { GetPaginatedTaskNamesContract } from '../api/contracts';

export type TaskNamesSelectorProps = Select.RootProps & {
    onChange?: (type: TaskName | undefined) => void;
};

export function TaskNamesSelector(props: TaskNamesSelectorProps) {
    return (
        <GenericAsyncSelector
            endpoint="/task-names"
            parse={(data) => GetPaginatedTaskNamesContract.parse(data)}
            displayField="title"
            queryParam="title"
            placeholder="Введите название задачи"
            {...props}
        />
    );
}
