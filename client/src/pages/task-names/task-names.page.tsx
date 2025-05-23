import { Flex } from '@radix-ui/themes';

import { TaskNamesBuilder } from './ui/task-names-builder.ui';

export default function TaskNamesPage() {
    return (
        <TaskNamesBuilder.Root>
            <Flex width="25%" gap="4" pl="3">
                <TaskNamesBuilder.Create />
                <TaskNamesBuilder.TitleFilter />
            </Flex>
            <TaskNamesBuilder.DataTable
                actionEndTitle="Управление"
                actionEnd={(taskName) => (
                    <Flex gap="2" justify="center">
                        <TaskNamesBuilder.Edit taskName={taskName} />
                        <TaskNamesBuilder.Delete taskName={taskName} />
                    </Flex>
                )}
            />
        </TaskNamesBuilder.Root>
    );
}

// export function TaskNamesPage() {
//     const [searchParams] = useSearchParams();
//     const key = [...searchParams.values()].join();
//
//     return (
//         <Flex direction="column" gap="4" minHeight="100%">
//             <Flex gap="2">
//                 <CreateTaskNameButton />
//                 <SearchTaskNameByName />
//             </Flex>
//
//             <Suspense fallback={<Loader />} key={key}>
//                 <PaginatedTaskNamesTable
//                     actionEnd={{
//                         title: '',
//                         action: (taskName) => (
//                             <Flex gap="2">
//                                 <EditTaskNameButton taskName={taskName} />
//                                 <DeleteTaskNameButton taskName={taskName} />
//                             </Flex>
//                         )
//                     }}
//                 />
//             </Suspense>
//         </Flex>
//     );
// }
