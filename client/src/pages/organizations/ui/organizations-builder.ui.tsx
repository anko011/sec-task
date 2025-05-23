import { useState } from 'react';
import { toast } from 'react-toastify';
import { takeFirstElements, useStrictContext } from '~/shared/lib';

import { CreateOrganizationButton, DeleteOrganizationButton, EditOrganizationButton } from '~/features/organizations';

import {
    CreateOrganizationContract,
    EditOrganizationContract,
    GetOrganizationContract,
    type Organization,
    type OrganizationFormErrors,
    type OrganizationFormValues,
    OrganizationsView,
    OrganizationsViewContext
} from '~/entities/organizations';
import { axiosInstance } from '~/shared/api';
import type { z } from 'zod';

function Delete({ organization }: { organization: Organization }) {
    const { mutate } = useStrictContext(OrganizationsViewContext);

    const remove = async (id: string) => {
        await axiosInstance.delete(`/organizations/${id}`);
        await mutate();
    };

    const action = async () => {
        await remove(organization.id);
        toast.success(`Организация ${organization.name} успешно удалена`);
    };
    return <DeleteOrganizationButton organization={organization} action={action} />;
}

type EditOrganizationDto = z.infer<typeof EditOrganizationContract>;

function Edit({ organization }: { organization: Organization }) {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate } = useStrictContext(OrganizationsViewContext);

    const edit = async (id: string, data: EditOrganizationDto) => {
        const response = await axiosInstance.patch(`/organizations/${id}`, data);
        await mutate();
        return GetOrganizationContract.parse(response.data);
    };

    const action = async (values: OrganizationFormValues): Promise<OrganizationFormErrors> => {
        const validation = EditOrganizationContract.safeParse(values);
        if (validation.success) {
            await edit(organization.id, validation.data);
            await mutate();
            toast.success('Организация успешно отредактирована');
            setIsOpen(false);
            return {};
        }

        return takeFirstElements(validation.error.flatten().fieldErrors);
    };
    return <EditOrganizationButton action={action} isOpen={isOpen} setIsOpen={setIsOpen} organization={organization} />;
}

type CreateOrganizationDto = z.infer<typeof CreateOrganizationContract>;

function Create() {
    const { mutate } = useStrictContext(OrganizationsViewContext);
    const [isOpen, setIsOpen] = useState(false);

    const create = async (data: CreateOrganizationDto) => {
        const response = await axiosInstance.post(`/organizations`, data);
        await mutate();
        return GetOrganizationContract.parse(response.data);
    };

    const action = async (values: OrganizationFormValues): Promise<OrganizationFormErrors> => {
        const validation = CreateOrganizationContract.safeParse(values);
        if (validation.success) {
            await create(validation.data);
            toast.success('Организация успешно создана');
            setIsOpen(false);
            return {};
        }
        return takeFirstElements(validation.error.flatten().fieldErrors);
    };
    return <CreateOrganizationButton setIsOpen={setIsOpen} isOpen={isOpen} action={action} />;
}

export const OrganizationsBuilder = {
    ...OrganizationsView,
    Create,
    Delete,
    Edit
};
