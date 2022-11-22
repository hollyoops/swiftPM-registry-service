import { Context, Request } from 'koa'
import * as Koa from 'koa'
import * as Router from '@koa/router'
import * as logger from 'koa-logger'

const app = new Koa()
const router = new Router()

const RESET_TOKEN = '\x1b[0m'
const UNDERSCORE_TOKEN = '\x1b[4m'

const logSection = (name: string, payload: any) => {
    if (!payload || !Object.keys(payload)?.length) return ''
    return `\n\n• ${name}:
${JSON.stringify(payload, null, 2)}`
}

const logRequest = (req: Request) => {
    console.log(`\n\n🆕 NEW ${UNDERSCORE_TOKEN}${req.method.toLocaleUpperCase()}${RESET_TOKEN} REQUEST 🆕
    
• Path: ${req.path}
• Full Url: ${req.url}${logSection('Headers', req.headers)}${logSection('Query', req.query)}${logSection(
        'Payload',
        req.body,
    )}
`)
}

router.get('/hello', (cxt: Context) => {
    cxt.body = { msg: 'Hello world' }
})

router.all('/(.*)+', async (cxt: Context) => {
    logRequest(cxt.request)
    cxt.status = 200
    cxt.body = { msg: 'yes' }
    // await next()
})

app.use(logger())

app.use(router.routes()).use(router.allowedMethods())

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
    console.log('Koa start success')
})
