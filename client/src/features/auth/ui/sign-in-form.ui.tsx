import { Button, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import { useActionState } from 'react';
import { useNavigate } from 'react-router';

import type { User } from '~/entities/users';
import { useCurrentUser } from '~/entities/users';
import { ChangeThemeButton } from '~/features/themes/change';

import { action as authAction } from '../model/auth.action';

export type SignInFormState = {
    formError?: string;
    user?: User;
};

export function SignInForm() {
    const { setUser } = useCurrentUser();
    const navigate = useNavigate();

    const action = async (state: SignInFormState, formData: FormData) => {
        const result = await authAction(state, formData);
        if (result.user !== undefined) {
            setUser(result.user);
            await navigate('/task-packages');
        }
        return result;
    };
    const [state, dispatch, pending] = useActionState(action, {});

    return (
        <form action={dispatch}>
            <Flex justify="between">
                <Heading as="h2">Авторизация</Heading>
                <ChangeThemeButton />
            </Flex>
            {state.formError != null && (
                <Text color="crimson" size="2">
                    {state.formError}
                </Text>
            )}
            <Flex asChild direction="column" mt="3">
                <label>
                    <Text weight="medium">E-mail</Text>
                    <TextField.Root name="email" />
                </label>
            </Flex>
            <Flex asChild direction="column" mt="3">
                <label>
                    <Text weight="medium">Пароль</Text>
                    <TextField.Root name="password" type="password" />
                </label>
            </Flex>

            <Button loading={pending} mt="5">
                Войти
            </Button>
        </form>
    );
}
