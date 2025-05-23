import type { Dispatch, SetStateAction } from 'react';
import useSWR from 'swr';
import { Checkbox, CheckboxGroup, Flex } from '@radix-ui/themes';
import type { CheckedState } from '@radix-ui/react-checkbox';

import { axiosInstance } from '~/shared/api';
import { Loader } from '~/shared/ui/loader';

import { GetAllOrganizationIdsContract } from '../api/contracts';
import { OrganizationsView } from './organizations-view.ui';

export type OrganizationsTableSelectorProps = {
    organizationIds: string[];
    setOrganizationIds: Dispatch<SetStateAction<string[]>>;
};

export function OrganizationsTableSelector({ setOrganizationIds, organizationIds }: OrganizationsTableSelectorProps) {
    const { data, isLoading } = useSWR('/organizations/ids', async (url) => {
        const response = await axiosInstance.get(url);
        return GetAllOrganizationIdsContract.parse(response.data);
    });

    const getIsAllChecked = () => {
        if (!data?.ids) return false;
        return data.ids.every((id) => organizationIds.includes(id));
    };

    const onAllOrganizationCheckedChange = (state: CheckedState) => {
        if (!data?.ids) return;
        setOrganizationIds(!!state ? data.ids : []);
    };

    if (!data || isLoading) return <Loader />;

    return (
        <Flex direction="column" gap="2" width="100%">
            <OrganizationsView.Root>
                <Flex gap="2" width="50%">
                    <OrganizationsView.NameFilter />
                    <OrganizationsView.TypeFilter />
                    <OrganizationsView.ArchivedFilter />
                </Flex>
                <CheckboxGroup.Root
                    style={{ width: '100%' }}
                    value={organizationIds}
                    onValueChange={(value) => {
                        setOrganizationIds(value);
                    }}
                >
                    <OrganizationsView.DataTable
                        actionStartTitle={
                            <Checkbox checked={getIsAllChecked()} onCheckedChange={onAllOrganizationCheckedChange} />
                        }
                        actionStart={(organization) => <CheckboxGroup.Item value={organization.id} />}
                    />
                </CheckboxGroup.Root>
            </OrganizationsView.Root>
        </Flex>
    );
}
