import { nonempty, object, string } from 'superstruct';

export const SignInFormSchema = object({
    email: nonempty(string()),
    password: nonempty(string())
});
