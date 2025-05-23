import { z } from 'zod';
import { GetOrganizationTypeContract } from '~/entities/organization-types';
import { paginated } from '~/shared/api';

export const GetAllOrganizationIdsContract = z.object({
    ids: z.array(z.string())
});

export const CreateOrganizationContract = z.object({
    name: z.string().nonempty({ message: 'Обязательное поле' }),
    typeId: z.preprocess(
        (id) => {
            return id === '-1' ? undefined : id;
        },
        z.string({ message: 'Обязательное поле' }).nonempty({ message: 'Обязательное поле' })
    ),
    isArchived: z.optional(z.boolean())
});

export const EditOrganizationContract = CreateOrganizationContract.partial();

export const GetOrganizationContract = z.object({
    id: z.string(),
    createdAt: z.string().transform((t) => {
        return new Date(t);
    }),
    updatedAt: z.string().transform((t) => {
        return new Date(t);
    }),
    name: z.string(),
    isArchived: z.boolean(),
    type: GetOrganizationTypeContract
});

export const GetPaginatedOrganizationsContract = paginated(GetOrganizationContract);
