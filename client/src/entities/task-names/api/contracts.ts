import { z } from 'zod';
import { paginated } from '~/shared/api';

export const GetTaskNameContract = z.object({
    id: z.string(),
    createdAt: z.string().transform((t) => {
        return new Date(t);
    }),
    updatedAt: z.string().transform((t) => {
        return new Date(t);
    }),
    title: z.string()
});

export const GetPaginatedTaskNamesContract = paginated(GetTaskNameContract);

export const CreateTaskNameContract = z.object({
    title: z.string({ message: 'Обязательное поле' }).nonempty({ message: 'Обязательное поле' })
});

export const EditTaskNameContract = CreateTaskNameContract.partial();
