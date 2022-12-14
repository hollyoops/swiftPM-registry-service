import { Context } from 'koa'
import { Request } from 'koa'

const RESET_TOKEN = '\x1b[0m'
const UNDERSCORE_TOKEN = '\x1b[4m'

const logSection = (name: string, payload: any) => {
    if (!payload || !Object.keys(payload)?.length) return ''
    return `\n\nā¢ ${name}:
${JSON.stringify(payload, null, 2)}`
}

const logRequest = (req: Request) => {
    console.log(`\n\nš NEW ${UNDERSCORE_TOKEN}${req.method.toLocaleUpperCase()}${RESET_TOKEN} REQUEST š
ā¢ Path: ${req.path}
ā¢ Full Url: ${req.url}${logSection('Headers', req.headers)}${logSection('Query', req.query)}${logSection(
        'Payload',
        req.body,
    )}
`)
}

export const customLogger = async function (ctx: Context, next: () => Promise<any>) {
    logRequest(ctx.request)
    await next()
}
