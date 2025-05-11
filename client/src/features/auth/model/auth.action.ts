import { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

import type { User } from '~/entities/users/model/user';

import { login } from '../api';
import type { SignInFormState } from '../ui/sign-in-form.ui';
import { SignInFormSchema } from './sign-in.schema';

export async function action(_: SignInFormState, formData: FormData): Promise<SignInFormState> {
    const credentials = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    const isValidForm = SignInFormSchema.is(credentials);

    if (!isValidForm)
        return {
            formError: 'Оба поля обязательны'
        };

    try {
        const { accessToken } = await login(credentials);
        const { user } = jwtDecode<{ user: User }>(accessToken);
        return { user };
    } catch (error) {
        if (error instanceof AxiosError && error.status === 401) {
            return {
                formError: 'Неверный email или пароль'
            };
        }
        throw error;
    }
}
