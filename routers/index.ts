import Router = require('@koa/router')
import { echo } from '../controller/echo'
import dummyPackageRouter from './dummyPackage'

const router = new Router()

router.use('/dummy', dummyPackageRouter.routes(), dummyPackageRouter.allowedMethods())
router.all('/echo', echo)

export default router
