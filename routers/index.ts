import Router = require('@koa/router')
import { echo } from '../controller/echo'
import { serverVersion } from '../controller/jfrog'
import dummyPackageRouter from './dummyPackage'

const router = new Router()

router.use('/dummy', dummyPackageRouter.routes(), dummyPackageRouter.allowedMethods())
router.all('/echo', echo)
router.get('/api/system/version', serverVersion)

export default router
