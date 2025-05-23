import { type Context, use } from 'react';

export function useStrictContext<T>(ctx: Context<T | null>) {
    const context = use(ctx);
    if (!context) throw new Error(`${ctx.name} ctx uses without provider`);
    return context;
}
