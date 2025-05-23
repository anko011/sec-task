import { Flex } from '@radix-ui/themes';
import { type ReactNode, useActionState, useState } from 'react';

import { type Organization, OrganizationsSelector } from '~/entities/organizations';

import { ClearableTextField } from '~/shared/ui/clearable-text-field';
import { FormField } from '~/shared/ui/form-field';

import { Role, type User, type UserWithOrganization } from '../model/user';
import { UserRolesSelector } from './user-roles-selector.ui';

export type UserFormValues = {
    firstName?: string;
    secondName?: string;
    patronymic?: string;
    email?: string;
    password?: string;
    role?: Role;
    organizationId?: string;
};

export type UserFormErrors = {
    firstName?: string;
    secondName?: string;
    patronymic?: string;
    email?: string;
    password?: string;
    organizationId?: string;
    role?: string;
};

export type UserFormProps = {
    action?: (values: UserFormValues) => Promise<UserFormErrors> | UserFormErrors;
    end?: ReactNode;
    user?: User | UserWithOrganization;
};

export function UserForm({ action, end, user }: UserFormProps) {
    const [role, setRole] = useState<Role | undefined>(user?.role);

    const organizationId = !!user
        ? typeof user.organization === 'string'
            ? user.organization
            : user.organization?.id
        : undefined;

    const [orgId, setOrgId] = useState(organizationId);

    const onChangeOrganization = (organization?: Organization) => {
        setOrgId(organization?.id);
    };

    const submit = async (errors: UserFormErrors, formData?: FormData): Promise<UserFormErrors> => {
        if (!action) return errors;
        console.log(orgId);
        return action({
            firstName: formData?.get('firstName') as string,
            secondName: formData?.get('secondName') as string,
            patronymic: formData?.get('patronymic') as string,
            email: formData?.get('email') as string,
            password: formData?.get('password') as string,
            organizationId: orgId,
            role
        });
    };
    const [errors, dispatch] = useActionState(submit, {});

    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <Flex gap="2">
                    <FormField error={errors?.firstName} label="Имя">
                        <ClearableTextField defaultValue={user?.firstName} name="firstName" placeholder="Введите имя" />
                    </FormField>
                    <FormField error={errors?.secondName} label="Фамилия">
                        <ClearableTextField
                            defaultValue={user?.secondName}
                            name="secondName"
                            placeholder="Введите фамилию"
                        />
                    </FormField>
                    <FormField error={errors?.patronymic} label="Отчество">
                        <ClearableTextField
                            defaultValue={user?.patronymic}
                            name="patronymic"
                            placeholder="Введите отчество"
                        />
                    </FormField>
                </Flex>

                <Flex gap="2">
                    <FormField error={errors?.email} label="Email">
                        <ClearableTextField
                            defaultValue={user?.email}
                            name="email"
                            placeholder="Введите email"
                            type="email"
                        />
                    </FormField>

                    <FormField error={errors?.password} label="Пароль">
                        <ClearableTextField name="password" type="password" />
                    </FormField>
                </Flex>

                <FormField error={errors?.role} label="Роль">
                    <UserRolesSelector value={role} onChange={setRole} name="role" />
                </FormField>

                {!!role && role === Role.Assigner && (
                    <FormField error={errors.organizationId} label="Организация">
                        <OrganizationsSelector
                            defaultValue={organizationId}
                            onChange={onChangeOrganization}
                            name="organizationId"
                        />
                    </FormField>
                )}

                {end}
            </form>
        </Flex>
    );
}
