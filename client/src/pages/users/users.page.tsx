import { Flex } from '@radix-ui/themes';
import { UsersBuilder } from './ui/users-builder.ui';
import { PackageRegistryButton } from '~/features/users';

export default function UsersPage() {
    return (
        <UsersBuilder.Root>
            <Flex width="100%" gap="4" pl="3">
                <UsersBuilder.Create />
                <PackageRegistryButton />
                <UsersBuilder.EmailFilter />
                <UsersBuilder.FirstNameFilter />
                <UsersBuilder.SecondNameFilter />
                <UsersBuilder.PatronymicNameFilter />
                <UsersBuilder.OrganizationNameFilter />
                <UsersBuilder.RoleFilter />
            </Flex>
            <UsersBuilder.DataTable
                actionEndTitle="Управление"
                actionEnd={(user) => (
                    <Flex gap="2" justify="center">
                        <UsersBuilder.Edit user={user} />
                        <UsersBuilder.Delete user={user} />
                    </Flex>
                )}
            />
        </UsersBuilder.Root>
    );
}

// export default function UsersPage() {
//     const [searchParams] = useSearchParams();
//     const key = [...searchParams.values()].join();
//
//     return (
//         <Flex direction="column" gap="4" minHeight="100%">
//             <Flex gap="2">
//                 <CreateUserButton />
//                 <SearchUsersByEmail />
//                 <SearchUsersByFirstName />
//                 <SearchUsersBySecondName />
//                 <SearchUsersByPatronymic />
//                 <SearchUsersByRole />
//                 <SearchUsersByOrganizationName />
//             </Flex>
//
//             <Suspense fallback={<Loader />} key={key}>
//                 <PaginatedUsersWithOrganizationTable
//                     actionEnd={{
//                         title: '',
//                         action: (user) => (
//                             <Flex gap="2">
//                                 <EditUserButton user={user} />
//                                 <DeleteUserButton user={user} />
//                             </Flex>
//                         )
//                     }}
//                 />
//             </Suspense>
//         </Flex>
//     );
// }
