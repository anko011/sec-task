import { array, object, string } from 'superstruct';

export const GetTaskCategoryContract = object({
    id: string(),
    name: string(),
    color: string()
});

export const GetAllTaskCategoriesContract = array(GetTaskCategoryContract);
