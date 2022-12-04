import * as Koa from 'koa'
import * as logger from 'koa-logger'
import router from './routers'
import { PORT } from './shared/config'
import { customLogger } from './shared/middlewares/logger'

const app = new Koa()

app.use(logger())
app.use(customLogger)
app.use(router.routes())

app.listen(PORT, () => {
    console.log('Swift registry services start successfully')
})
