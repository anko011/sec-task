export type Paginated<T> = T extends (infer R)[]
  ? {
      readonly items: R[];
      readonly total: number;
      readonly limit: number;
      readonly offset: number;
    }
  : never;

export type PaginationOptions = {
  limit?: number;
  offset?: number;
};
