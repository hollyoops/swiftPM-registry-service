import { BaseContext } from 'koa'

export const errorHandler = async function (ctx: BaseContext, next: () => Promise<any>) {
    try {
        await next()
    } catch (err) {
        // will only respond with JSON
        ctx.status = err.statusCode || err.status || 500
        ctx.body = {
            message: err.message,
        }
    }
}
