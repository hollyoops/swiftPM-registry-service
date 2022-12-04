import { Context } from 'koa'
import fetch from 'node-fetch'

export const listPackages = async function (ctx: Context) {
    const packageURL = `https://${ctx.host}/dummy/moya/moya/15.0.3`
    ctx.set({
        Link: `<${packageURL}>; rel="latest-version",<https://github.com/moya/moya>; rel="canonical"`,
        'Content-Version': '1',
        'Content-Type': 'application/json',
    })
    ctx.body = {
        releases: {
            '15.0.3': {
                url: packageURL,
            },
            '15.0.1': {
                url: packageURL,
            },
            '15.0.0': {
                url: packageURL,
            },
            '14.0.1': {
                url: packageURL,
            },
            '14.0.0': {
                url: packageURL,
            },
        },
    }
}

export const fetchMetaForPackage = async function (ctx: Context) {
    ctx.set({
        Link: `<https://${ctx.host}/dummy/moya/moya/15.0.3>; rel="latest-version"`,
        'Content-Type': 'application/json',
    })
    ctx.body = {
        id: 'moya.moya',
        version: ctx.params.version,
        resources: [
            {
                name: 'source-archive',
                type: 'application/zip',
                checksum: 'c263811c1f3dbf002be9bd83107f7cdc38992b26',
            },
        ],
        metadata: {},
    }
}

export const fetchManifestForPackage = async function (ctx: Context) {
    const toolVersion = ctx.query['swift-version']
    const url = `https://raw.githubusercontent.com/Moya/Moya/15.0.3/Package.swift`
    const response = await fetch(url)
    ctx.set({
        'Content-Type': 'text/x-swift',
        'Content-Disposition': `attachment; filename="Package@swift-${toolVersion}.swift"`,
        'Content-Version': '1',
    })
    ctx.body = response.body
}

export const downloadSourceCode = async function (ctx: Context) {
    const url = 'https://api.github.com/repos/Moya/Moya/zipball/refs/tags/15.0.3'
    const hash = 'c263811c1f3dbf002be9bd83107f7cdc38992b26'
    const digestBase64 = Buffer.from(hash).toString('base64')

    ctx.set({
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, immutable',
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="Moya-Moya-15.0.3-0-gc263811"',
        Digest: `sha-256=${digestBase64}`,
        Link: `<${url}>;type="application/zip"`,
        'Content-Version': '1',
    })
    const response = await fetch(url)
    ctx.body = response.body
}

export const getIdentifiers = async function (ctx: Context) {
    ctx.set({
        'Content-Version': '1',
        'Content-Type': 'application/json',
    })
    ctx.body = {
        identifiers: ['moya.moya'],
    }
}
