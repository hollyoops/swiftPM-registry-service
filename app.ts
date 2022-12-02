import * as Koa from 'koa'
import * as logger from 'koa-logger'
import router from './routers'
import { customLogger } from './shared/middlewares/logger'

const app = new Koa()

app.use(logger())
app.use(customLogger)
app.use(router.routes())

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
    console.log('Swift registry services start successfully')
})
