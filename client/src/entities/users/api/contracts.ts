import { z } from 'zod';
import { GetOrganizationContract } from '~/entities/organizations';
import { paginated } from '~/shared/api';

import { Role } from '../model';
import { deepCleanObject } from '~/shared/lib';

export const GetUserContract = z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    secondName: z.string(),
    patronymic: z.string(),
    organization: z.string().nullable(),
    role: z.nativeEnum(Role)
});

export const GetPaginatedUsersContract = paginated(GetUserContract);

export const GetUserWithOrganizationContract = z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    secondName: z.string(),
    patronymic: z.string(),
    organization: GetOrganizationContract.nullish(),
    role: z.nativeEnum(Role)
});

export const GetPaginatedUsersWithOrganizationContract = paginated(GetUserWithOrganizationContract);

const BaseUserSchema = z.object({
    email: z.string().nonempty({ message: 'Обязательное поле' }),
    firstName: z.string().nonempty({ message: 'Обязательное поле' }),
    secondName: z.string().nonempty({ message: 'Обязательное поле' }),
    patronymic: z.string().nonempty({ message: 'Обязательное поле' }),
    organizationId: z.string().nonempty().nullish(),
    role: z.nativeEnum(Role, { message: 'Обязательное поле' }),
    password: z.preprocess(
        (v) => {
            return v === '' ? undefined : v;
        },
        z.string({ message: 'Обязательное поле' }).nonempty({ message: 'Обязательное поле' })
    )
});

export const CreateUserContract = BaseUserSchema.refine(
    (data) => {
        return data.role !== Role.Assigner || data.organizationId !== undefined;
    },
    {
        message: 'Organization is required for Assigner role',
        path: ['organization']
    }
);

export const EditUserContract = z.preprocess(
    (value) => {
        return typeof value === 'object' ? deepCleanObject(value) : value;
    },
    z
        .object({
            email: z.string().optional(),
            firstName: z.string().optional(),
            secondName: z.string().optional(),
            patronymic: z.string().optional(),
            organizationId: z.string().optional().nullish(),
            role: z.nativeEnum(Role).optional(),
            password: z.string().optional()
        })
        .superRefine((data, ctx) => {
            if (data.role === Role.Assigner && data.organizationId === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Organization is required when role is Assigner',
                    path: ['organization']
                });
            }
        })
);
