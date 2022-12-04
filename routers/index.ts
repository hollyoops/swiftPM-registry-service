import Router = require('@koa/router')
import { echo } from '../controller/echo'
import { health, serverVersion, info } from '../controller/base'
import dummyPackageRouter from './dummyPackage'

const router = new Router()

router.use('/dummy', dummyPackageRouter.routes(), dummyPackageRouter.allowedMethods())
router.all('/echo', echo)
router.get('/api/system/version', serverVersion)
router.get('/__health', health)
router.get('/', info)

export default router
