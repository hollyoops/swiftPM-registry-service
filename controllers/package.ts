import { Context } from 'koa'
import { downloadZipFile, fetchIdentifiers, fetchManifest, fetchTags, fetchZipHash } from '../services/githubService'
import { IGithubTag, IPackageReleases } from '../services/types'
import { parseRequestArgs } from './utils'

export const listPackages = async function (ctx: Context) {
    const { scope, pkg } = parseRequestArgs(ctx)
    const tags = await fetchTags(scope, pkg)

    ctx.set('Content-Type', 'application/json')
    if (tags.length > 0) {
        const latestVersion = tags[0].name
        const links = [
            `<https://${ctx.host}/${scope}/${pkg}/${latestVersion}>; rel="latest-version"`,
            `<https://github.com/${scope}/${pkg}>; rel="canonical"`,
            `<ssh://git@github.com:${scope}/${pkg}.git>; rel="alternate"`,
        ]

        ctx.append('Link', links.join(','))
    }

    const releases = tags.reduce((pre: IPackageReleases, current: IGithubTag) => {
        const releaseVersion = current.name
        return {
            ...pre,
            [releaseVersion]: {
                url: `https://${ctx.host}/${scope}/${pkg}/${releaseVersion}`,
            },
        }
    }, {})
    ctx.body = { releases }
}

export const fetchMetaForPackage = async function (ctx: Context) {
    const { scope, pkg, version } = parseRequestArgs(ctx)
    const zipHash = await fetchZipHash(scope, pkg, version)

    ctx.set({
        Link: `<https://${ctx.host}/${scope}/${pkg}/${version}>; rel="latest-version"`,
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
    const packageString = await fetchManifest(scope, pkg, version)
    ctx.set({
        'Content-Type': 'text/x-swift',
        'Content-Disposition': `attachment; filename="Package@swift-${toolVersion}.swift"`,
    })
    ctx.body = packageString
}

export const downloadSourceCode = async function (ctx: Context) {
    const { scope, pkg, version } = parseRequestArgs(ctx)
    const fileInfo = await downloadZipFile(scope, pkg, version)

    ctx.set({
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, immutable',
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${version}.zip"`,
        // Digest: `sha-256=${fileInfo.hashValue}`,
        Link: `<${fileInfo.url}>;type="application/zip"`,
    })
    ctx.body = fileInfo.fileStream
}

export const getIdentifiers = function (ctx: Context) {
    ctx.set({
        'Content-Type': 'application/json',
    })

    ctx.body = {
        identifiers: fetchIdentifiers(ctx.query.url),
    }
}
