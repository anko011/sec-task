import { Flex, TextField } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { useActionState } from 'react';

import type { UserWithOrganization } from '~/entities/users';
import { type User, UserRolesSelector } from '~/entities/users';
import { FilterOrganizationSelector } from '~/features/organizations/filter';
import { FormField } from '~/shared/ui/form-field';

export type UserFormState = { isSuccess: boolean } & Partial<
    Omit<User, 'id' | 'role'> & {
        organizationId: string;
        password: string;
        role: string;
    }
>;

type UserFormProps = {
    action: (prevState: UserFormState, formData: FormData) => Promise<UserFormState>;
    end?: ReactNode;
    user?: User | UserWithOrganization;
};

export function UserForm({ action, end, user }: UserFormProps) {
    const [state, dispatch] = useActionState(action, { isSuccess: true });
    const organizationId = user != null && 'organization' in user ? user.organization.id : user?.organizationId;

    return (
        <Flex asChild direction="column" gap="2">
            <form action={dispatch}>
                <Flex gap="2">
                    <FormField error={state.firstName} label="Имя">
                        <TextField.Root defaultValue={user?.firstName} name="firstName" placeholder="Иван" />
                    </FormField>
                    <FormField error={state.secondName} label="Фамилия">
                        <TextField.Root defaultValue={user?.secondName} name="secondName" placeholder="Иванов" />
                    </FormField>
                    <FormField error={state.patronymic} label="Отчество">
                        <TextField.Root defaultValue={user?.patronymic} name="patronymic" placeholder="Иванович" />
                    </FormField>
                </Flex>

                <Flex gap="2">
                    <FormField error={state.email} label="Email">
                        <TextField.Root defaultValue={user?.email} name="email" placeholder="name@mail.ru" />
                    </FormField>
                    <FormField error={state.organizationId} label="Организация">
                        <FilterOrganizationSelector defaultValue={organizationId} name="organizationId" />
                    </FormField>
                </Flex>

                <FormField error={state.role} label="Роль">
                    <UserRolesSelector defaultValue={user?.role} name="role" />
                </FormField>

                <FormField error={state.password} label="Пароль">
                    <TextField.Root name="password" type="password" />
                </FormField>

                {end}
            </form>
        </Flex>
    );
}
