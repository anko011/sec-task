export function takeFirstElements<T extends Record<string, string[]>>(obj: T): { [K in keyof T]: string } {
    const result: any = {};

    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            result[key] = obj[key]?.at(0);
        }
    }

    return result;
}
