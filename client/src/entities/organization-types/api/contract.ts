import { array, object, string } from 'superstruct';

export const GetOrganizationTypeByIdContract = object({
    id: string(),
    name: string()
});

export const GetAllOrganizationTypesContract = array(GetOrganizationTypeByIdContract);
