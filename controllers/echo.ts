import { Context } from 'koa'

export const echo = async function (ctx: Context) {
    ctx.body = {
        method: ctx.req.method,
        url: ctx.req.url,
        headers: ctx.req.headers,
        Body: ctx.request.body,
    }
}
