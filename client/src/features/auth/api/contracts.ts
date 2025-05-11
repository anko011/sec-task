import { object, string } from 'superstruct';

export const GetAuthTokenContract = object({
    accessToken: string()
});
