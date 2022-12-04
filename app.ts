import * as Koa from 'koa'
import * as logger from 'koa-logger'
import router from './routers'
import { PORT } from './shared/config'
import { headers } from './shared/middlewares/allHeaders'
import { customLogger } from './shared/middlewares/logger'

const app = new Koa()

app.use(headers)
app.use(logger())
app.use(customLogger)
app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, () => {
    console.log('Swift registry services started successfully!')
})
