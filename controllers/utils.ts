import { Context } from 'koa'

export const parseRequestArgs = function (ctx: Context) {
    return {
        scope: ctx.params.scope,
        pkg: ctx.params.package,
        version: ctx.params.version || '',
    }
}
