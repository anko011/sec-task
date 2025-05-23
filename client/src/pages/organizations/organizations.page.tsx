import { Flex } from '@radix-ui/themes';
import { OrganizationsBuilder } from './ui/organizations-builder.ui';

export default function OrganizationsPage() {
    return (
        <OrganizationsBuilder.Root>
            <Flex width="50%" gap="4" pl="3">
                <OrganizationsBuilder.Create />
                <OrganizationsBuilder.NameFilter />
                <OrganizationsBuilder.TypeFilter />
                <OrganizationsBuilder.ArchivedFilter />
            </Flex>
            <OrganizationsBuilder.DataTable
                actionEndTitle="Управление"
                actionEnd={(organization) => (
                    <Flex gap="2" justify="center">
                        <OrganizationsBuilder.Edit organization={organization} />
                        <OrganizationsBuilder.Delete organization={organization} />
                    </Flex>
                )}
            />
        </OrganizationsBuilder.Root>
    );
}

// export function OrganizationsPage() {
//     const [searchParams] = useSearchParams();
//
//     const key = [...searchParams.values()].join();
//
//     return (
//         <Flex direction="column" gap="4" minHeight="100%">
//             <Flex gap="2">
//                 <CreateOrganizationButton />
//                 <SearchOrganizationsByName />
//                 <SearchOrganizationsByType />
//                 <SearchOrganizationsByArchiveStatus />
//             </Flex>
//
//             <Suspense fallback={<Loader />} key={key}>
//                 <PaginatedOrganizationsTable
//                     actionEnd={{
//                         title: '',
//                         action: (organization) => (
//                             <Flex gap="2">
//                                 <EditOrganizationButton organization={organization} />
//                                 <DeleteOrganizationButton organization={organization} />
//                             </Flex>
//                         )
//                     }}
//                 />
//             </Suspense>
//         </Flex>
//     );
// }
