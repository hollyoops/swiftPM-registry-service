import { BaseContext } from 'koa'

export const headers = async function (ctx: BaseContext, next: () => Promise<any>) {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, HEAD')
    ctx.set('Content-Version', '1')
    await next()
}
