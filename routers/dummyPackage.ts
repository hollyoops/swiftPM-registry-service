import Router = require('@koa/router')
import {
    downloadSourceCode,
    fetchManifestForPackage,
    fetchMetaForPackage,
    getIdentifiers,
    listPackages,
} from '../controller/dummyPackage'

const packageRouter = new Router()

packageRouter.get('/:scope/:package', listPackages)
packageRouter.get('/:scope/:package/:version(\\d+.\\d+$|\\d+.\\d+.\\d+$)', fetchMetaForPackage)
packageRouter.get('/:scope/:package/:version/Package.swift', fetchManifestForPackage)
packageRouter.get('/:scope/:package/:version(\\d+.\\d+.zip$|\\d+.\\d+.\\d+.zip$)', downloadSourceCode)
packageRouter.get('/identifiers', getIdentifiers)

export default packageRouter
