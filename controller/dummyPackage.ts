import { Context } from 'koa'
import fetch from 'node-fetch'

const zipHash = 'b073488c4b31bfc760903aaaf965db73a9d0be687c3656566c9d653fdecd0507'
const mockId = 'hollyoops.ReactiveForm'
const scopeName = 'hollyoops/ReactiveForm'
const tVersion = '0.2.0'
const subPath = `${scopeName}/${tVersion}`

export const listPackages = async function (ctx: Context) {
    const packageURL = `https://${ctx.host}/${subPath}`
    ctx.set({
        Link: `<${packageURL}>; rel="latest-version"`,
        'Content-Type': 'application/json',
    })
    ctx.body = {
        releases: {
            '0.2.0': {
                url: packageURL,
            },
            '0.1.0': {
                url: packageURL,
            },
        },
    }
}

export const fetchMetaForPackage = async function (ctx: Context) {
    const packageURL = `https://${ctx.host}/${subPath}`
    ctx.set({
        Link: `<${packageURL}>; rel="latest-version"`,
        'Content-Type': 'application/json',
    })
    ctx.body = {
        id: mockId,
        version: ctx.params.version,
        resources: [
            {
                name: 'source-archive',
                type: 'application/zip',
                checksum: zipHash,
            },
        ],
        metadata: {},
    }
}

export const fetchManifestForPackage = async function (ctx: Context) {
    const toolVersion = ctx.query['swift-version'] || '5.7'
    const url = `https://raw.githubusercontent.com/${subPath}/Package.swift`
    const response = await fetch(url)
    ctx.set({
        'Content-Type': 'text/x-swift',
        'Content-Disposition': `attachment; filename="Package@swift-${toolVersion}.swift"`,
    })
    ctx.body = response.body
}

export const downloadSourceCode = async function (ctx: Context) {
    const url = `https://api.github.com/repos/${scopeName}/zipball/refs/tags/${tVersion}`
    const digestBase64 = Buffer.from(zipHash).toString('base64')

    ctx.set({
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, immutable',
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${tVersion}.zip"`,
        Digest: `sha-256=${digestBase64}`,
        Link: `<${url}>;type="application/zip"`,
    })
    const response = await fetch(url)
    ctx.body = response.body
}

export const getIdentifiers = async function (ctx: Context) {
    ctx.set({
        'Content-Type': 'application/json',
    })
    ctx.body = {
        identifiers: [mockId],
    }
}
