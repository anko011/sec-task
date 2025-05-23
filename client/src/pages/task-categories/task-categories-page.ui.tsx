import { Flex } from '@radix-ui/themes';
import { TaskCategoriesBuilder } from './ui/task-categories-builder.ui';

export default function TaskCategoriesPage() {
    return (
        <TaskCategoriesBuilder.Root>
            <Flex width="30%" gap="4" pl="3">
                <TaskCategoriesBuilder.Create />
                <TaskCategoriesBuilder.TitleFilter />
                <TaskCategoriesBuilder.ColorFilter />
            </Flex>
            <TaskCategoriesBuilder.DataTable
                actionEndTitle="Управление"
                actionEnd={(taskCategory) => (
                    <Flex gap="2" justify="center">
                        <TaskCategoriesBuilder.Edit taskCategory={taskCategory} />
                        <TaskCategoriesBuilder.Delete taskCategory={taskCategory} />
                    </Flex>
                )}
            />
        </TaskCategoriesBuilder.Root>
    );
}

//
// export function TaskCategoriesPage() {
//     const [searchParams] = useSearchParams();
//     const key = [...searchParams.values()].join();
//
//     return (
//         <Flex direction="column" gap="4" minHeight="100%">
//             <Flex gap="2">
//                 <CreateTaskCategoryButton />
//                 <SearchTaskCategoriesByName />
//             </Flex>
//
//             <Suspense fallback={<Loader />} key={key}>
//                 <PaginatedTaskCategoryTable
//                     actionEnd={{
//                         title: '',
//                         action: (taskCategory) => (
//                             <Flex gap="2">
//                                 <EditTaskCategoryButton taskCategory={taskCategory} />
//                                 <DeleteTaskCategoryButton taskCategory={taskCategory} />
//                             </Flex>
//                         )
//                     }}
//                 />
//             </Suspense>
//         </Flex>
//     );
// }
