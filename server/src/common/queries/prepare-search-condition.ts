import { deepCleanObject } from '~/common/utils';

export const prepareSearchConditions = <T extends Record<string, unknown>>(
  where: T,
  options: { exactMatchFields?: (keyof T)[] } = {},
): T => {
  const { exactMatchFields = ['id'] } = options;
  const conditions = deepCleanObject(where ?? {}) as T;

  const processValue = (key: string, value: any): any => {
    if (value === null || value === undefined) return value;

    if (exactMatchFields.includes(key)) {
      return typeof value === 'string' ? value.trim() : value;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      return { $like: `%${trimmed}%` };
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, processValue(k, v)]),
      );
    }

    if (Array.isArray(value)) {
      return value.map((v) => processValue(key, v));
    }

    return value;
  };

  return Object.fromEntries(
    Object.entries(conditions).map(([key, value]) => [
      key,
      processValue(key, value),
    ]),
  ) as T;
};
