import { Flex } from '@radix-ui/themes';

import { OrganizationTypesBuilder } from './ui/organization-types-builder.ui';

export default function OrganizationTypesPage() {
    return (
        <OrganizationTypesBuilder.Root>
            <Flex width="25%" gap="4" pl="3">
                <OrganizationTypesBuilder.Create />
                <OrganizationTypesBuilder.TitleFilter />
            </Flex>
            <OrganizationTypesBuilder.DataTable
                actionEndTitle="Управление"
                actionEnd={(organizationType) => (
                    <Flex gap="2" justify="center">
                        <OrganizationTypesBuilder.Edit organizationType={organizationType} />
                        <OrganizationTypesBuilder.Delete organizationType={organizationType} />
                    </Flex>
                )}
            />
        </OrganizationTypesBuilder.Root>
    );
}

// export function OrganizationTypesPage() {
//     const [searchParams] = useSearchParams([
//         ['limit', '10'],
//         ['offset', '0']
//     ]);
//     const key = [...searchParams.values()].join();
//
//     return (
//         <Flex direction="column" gap="4" minHeight="100%">
//             <Flex gap="2">
//                 <CreateOrganizationTypeButton />
//                 <SearchOrganizationTypesByName />
//             </Flex>
//
//             <Suspense fallback={<Loader />} key={key}>
//                 <PaginatedOrganizationTypesTable
//                     actionEnd={{
//                         title: '',
//                         action: (type) => (
//                             <Flex gap="2">
//                                 <EditOrganizationTypeButton organizationType={type} />
//                                 <DeleteOrganizationTypeButton organizationType={type} />
//                             </Flex>
//                         )
//                     }}
//                 />
//             </Suspense>
//         </Flex>
//     );
// }
