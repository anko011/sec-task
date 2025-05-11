import { Flex } from '@radix-ui/themes';
import React, { Suspense } from 'react';
import { useSearchParams } from 'react-router';

import { PaginatedTaskNamesTable } from '~/entities/task-names';
import { CreateTaskNameButton } from '~/features/task-names/create';
import { DeleteTaskNameButton } from '~/features/task-names/delete';
import { EditTaskNameButton } from '~/features/task-names/edit';
import { SearchTaskNameByName } from '~/features/task-names/filter';
import { Loader } from '~/shared/ui/loader';

export function TaskNamesPage() {
    const [searchParams] = useSearchParams();
    const key = [...searchParams.values()].join();

    return (
        <Flex direction="column" gap="4" minHeight="100%">
            <Flex gap="2">
                <CreateTaskNameButton />
                <SearchTaskNameByName />
            </Flex>

            <Suspense fallback={<Loader />} key={key}>
                <PaginatedTaskNamesTable
                    actionEnd={{
                        title: '',
                        action: (taskName) => (
                            <Flex gap="2">
                                <EditTaskNameButton taskName={taskName} />
                                <DeleteTaskNameButton taskName={taskName} />
                            </Flex>
                        )
                    }}
                />
            </Suspense>
        </Flex>
    );
}
