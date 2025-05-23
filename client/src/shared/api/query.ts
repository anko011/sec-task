import { AxiosError } from 'axios';
import type { Struct } from 'superstruct';
import { array, number, object } from 'superstruct';
import { z } from 'zod';

export type Paginated<T> = {
    readonly items: T[];
    readonly limit: number;
    readonly offset: number;
    readonly total: number;
};

export function deplecated_paginated<T>(contract: Struct<T>) {
    return object({
        items: array(contract),
        limit: number(),
        offset: number(),
        total: number()
    });
}

export function paginated<T extends z.ZodTypeAny>(schema: T) {
    return z.object({
        items: z.array(schema),
        total: z.number(),
        limit: z.number(),
        offset: z.number()
    });
}

export type PaginateOptions = {
    limit: number;
    offset: number;
    total?: number;
};

export function getFieldErrors(e: unknown) {
    if (e instanceof AxiosError && e.status === 400 && e.response) {
        const data = e.response.data as { errors: Record<string, string | undefined> };
        return 'errors' in data ? data.errors : data;
    }
    throw e;
}
