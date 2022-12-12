import { Context } from 'koa'
import * as crypto from 'crypto'
import fetch from 'node-fetch'

export const parseRequestArgs = function (ctx: Context) {
    return {
        scope: ctx.params.scope,
        pkg: ctx.params.package,
        version: ctx.params.version || '',
    }
}

export const getDownloadUrl = function (ctx: Context) {
    const { scope, pkg, version } = parseRequestArgs(ctx)
    return `https://api.github.com/repos/${scope}/${pkg}/zipball/refs/tags/${version}`
}

export const checksumRemoteFile = async function (remoteFile: string, hashName = 'sha256') {
    const { body: stream } = await fetch(remoteFile)

    return await new Promise((resolve, reject) => {
        const hash = crypto.createHash(hashName)
        stream.on('error', (err) => reject(err))
        stream.pipe(hash)
        stream.on('end', () => resolve(hash.digest('hex')))
    })
}

export const getIdentifiersForURLs = function (url: string | string[]) {
    const urlList: string[] = Array.isArray(url) ? url : [url]
    const githubHttpPrefix = 'https://github.com/'
    const githubSSHPrefix = 'git@github.com:'

    return urlList
        .map((url) => {
            if (!url || (!url.startsWith(githubHttpPrefix) && !url.startsWith(githubSSHPrefix))) {
                return undefined
            }

            return url
                .replace(githubHttpPrefix, '')
                .replace(githubSSHPrefix, '')
                .replace('.git', '')
                .split('/')
                .join('.')
        })
        .filter((url) => !!url)
}
