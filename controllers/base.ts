import { BaseContext } from 'koa'

export const health = function (ctx: BaseContext) {
    ctx.status = 200
}

export const info = function (ctx: BaseContext) {
    ctx.body = `
    Package Registry Service
    Addresses: empty
    `
}

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
