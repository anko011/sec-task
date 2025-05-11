import { AxiosError } from 'axios';
import type { Struct } from 'superstruct';
import { array, number, object } from 'superstruct';

export type Paginated<T> = {
    readonly items: T[];
    readonly limit: number;
    readonly offset: number;
    readonly total: number;
};

export function paginated<T>(contract: Struct<T>) {
    return object({
        items: array(contract),
        limit: number(),
        offset: number(),
        total: number()
    });
}

export type PaginateOptions = {
    limit?: number;
    offset?: number;
};

export function getFieldErrors(e: unknown) {
    if (e instanceof AxiosError && e.status === 400 && e.response != null) {
        const data = e.response.data as { errors: Record<string, string | undefined> };
        return data.errors;
    }
    throw e;
}
