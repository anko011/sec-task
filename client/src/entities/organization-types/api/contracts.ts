import { z } from 'zod';
import { paginated } from '~/shared/api';

export const GetOrganizationTypeContract = z.object({
    id: z.string(),
    createdAt: z.string().transform((t) => {
        return new Date(t);
    }),
    updatedAt: z.string().transform((t) => {
        return new Date(t);
    }),
    title: z.string()
});

export const GetPaginatedOrganizationTypesContract = paginated(GetOrganizationTypeContract);

export const CreateOrganizationTypeContract = z.object({
    title: z.string().nonempty({ message: 'Обязательное поле' })
});

export const EditOrganizationTypeContract = CreateOrganizationTypeContract.partial();
