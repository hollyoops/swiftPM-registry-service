import { BaseContext } from 'koa'

export const serverVersion = function (ctx: BaseContext) {
    ctx.set({
        'Content-Type': 'application/json',
    })
    ctx.body = {
        version: '0.0.1',
        revision: '10427',
        addons: ['build', 'ldap', 'properties', 'rest', 'search', 'sso', 'watch', 'webstart'],
    }
}
