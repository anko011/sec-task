import { z } from 'zod';
import { paginated } from '~/shared/api';

export const GetTaskCategoryContract = z.object({
    id: z.string(),
    createdAt: z.string().transform((t) => {
        return new Date(t);
    }),
    updatedAt: z.string().transform((t) => {
        return new Date(t);
    }),
    title: z.string(),
    color: z.string()
});

export const GetPaginatedTaskCategoriesContract = paginated(GetTaskCategoryContract);

export const CreateTaskCategoryContract = z.object({
    title: z.string({ message: 'Обязательное поле' }).nonempty({ message: 'Обязательное поле' }),
    color: z.string({ message: 'Обязательное поле' }).nonempty({ message: 'Обязательное поле' })
});

export const EditTaskCategoryContract = CreateTaskCategoryContract.partial();
