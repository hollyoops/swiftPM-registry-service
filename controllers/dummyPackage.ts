import { Context } from 'koa'
import fetch from 'node-fetch'
import { IGithubTag, IPackageReleases } from './types'
import { parseRequestArgs, getDownloadUrl, checksumRemoteFile, getIdentifiersForURLs } from './utils'

export const listPackages = async function (ctx: Context) {
    const { scope, pkg } = parseRequestArgs(ctx)
    const githubTags = `https://api.github.com/repos/${scope}/${pkg}/tags`
    const response = await fetch(githubTags)
    const tags: [IGithubTag] = await response.json()
    const releases = tags.reduce((pre: IPackageReleases, current: IGithubTag) => {
        const releaseVersion = current.name
        const url = `https://${ctx.host}/${scope}/${pkg}/${releaseVersion}`
        return {
            ...pre,
            [releaseVersion]: {
                url,
            },
        }
    }, {})

    ctx.set('Content-Type', 'application/json')
    if (tags.length > 0) {
        const lastVersion = `https://${ctx.host}/${scope}/${pkg}/${tags[0].name}`
        ctx.set('Link', `<${lastVersion}>; rel="latest-version"`)
    }

    ctx.body = { releases }
}

export const fetchMetaForPackage = async function (ctx: Context) {
    const zipUrl = getDownloadUrl(ctx)
    const zipHash = await checksumRemoteFile(zipUrl)
    const { scope, pkg, version } = parseRequestArgs(ctx)
    const releaseUrl = `https://${ctx.host}/${scope}/${pkg}/${version}`
    ctx.set({
        Link: `<${releaseUrl}>; rel="latest-version"`,
        'Content-Type': 'application/json',
    })

    ctx.body = {
        id: `${scope}.${pkg}`,
        version: version,
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
    const { scope, pkg, version } = parseRequestArgs(ctx)
    const url = `https://raw.githubusercontent.com/${scope}/${pkg}/${version}/Package.swift`
    const response = await fetch(url)
    ctx.set({
        'Content-Type': 'text/x-swift',
        'Content-Disposition': `attachment; filename="Package@swift-${toolVersion}.swift"`,
    })
    ctx.body = response.body
}

export const downloadSourceCode = async function (ctx: Context) {
    const { scope, pkg, version } = parseRequestArgs(ctx)
    const url = `https://api.github.com/repos/${scope}/${pkg}/zipball/refs/tags/${version}`
    // const digestBase64 = Buffer.from(zipHash).toString('base64')

    ctx.set({
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, immutable',
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${version}.zip"`,
        // Digest: `sha-256=${digestBase64}`,
        Link: `<${url}>;type="application/zip"`,
    })
    const response = await fetch(url)
    ctx.body = response.body
}

export const getIdentifiers = function (ctx: Context) {
    ctx.set({
        'Content-Type': 'application/json',
    })

    ctx.body = {
        identifiers: getIdentifiersForURLs(ctx.query.url),
    }
}
