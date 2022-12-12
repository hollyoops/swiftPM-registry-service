import Router = require('@koa/router')
import { health, info, serverVersion } from '../controllers/base'
import {
    downloadSourceCode,
    fetchManifestForPackage,
    fetchMetaForPackage,
    getIdentifiers,
    listPackages,
} from '../controllers/dummyPackage'

const packageRouter = new Router()

packageRouter.get('/:scope/:package', listPackages)
packageRouter.get('/:scope/:package/:version(\\d+.\\d+$|\\d+.\\d+.\\d+$)', fetchMetaForPackage)
packageRouter.get('/:scope/:package/:version/Package.swift', fetchManifestForPackage)
packageRouter.get('/:scope/:package/:version(\\d+.\\d+.zip$|\\d+.\\d+.\\d+.zip$)', downloadSourceCode)
packageRouter.get('/identifiers', getIdentifiers)
packageRouter.get('/api/system/version', serverVersion)
packageRouter.get('/__health', health)
packageRouter.get('/', info)

export default packageRouter
