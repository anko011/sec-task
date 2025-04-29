export type Paginated<T> = {
    readonly items: T[];
    readonly limit: number;
    readonly offset: number;
    readonly total: number;
};

export type PaginateOptions = {
    limit?: number;
    offset?: number;
};
