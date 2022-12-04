import Router = require('@koa/router')
import { echo } from '../controller/echo'
import { health, serverVersion, info } from '../controller/base'
import {
    listPackages,
    fetchMetaForPackage,
    fetchManifestForPackage,
    downloadSourceCode,
    getIdentifiers,
} from '../controller/dummyPackage'

const router = new Router()

router.get('/:scope/:package', listPackages)
router.get('/:scope/:package/:version(\\d+.\\d+$|\\d+.\\d+.\\d+$)', fetchMetaForPackage)
router.get('/:scope/:package/:version/Package.swift', fetchManifestForPackage)
router.get('/:scope/:package/:version(\\d+.\\d+.zip$|\\d+.\\d+.\\d+.zip$)', downloadSourceCode)
router.get('/identifiers', getIdentifiers)
router.all('/echo', echo)
router.get('/api/system/version', serverVersion)
router.get('/__health', health)
router.get('/', info)

export default router
