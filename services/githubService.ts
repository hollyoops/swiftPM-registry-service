import fetch, { BodyInit, HeadersInit, RequestInfo } from 'node-fetch'
import { IFileInfo, IGithubTag, IZipBarFile } from './types'
import { GITHUB_ACCESS_TOKEN } from '../shared/config'
import * as crypto from 'crypto'

export const fetchTags = async function (scope: string, pkg: string): Promise<[IGithubTag]> {
    const githubTags = `https://api.github.com/repos/${scope}/${pkg}/tags`
    const response = await authFetch(githubTags)
    return await response.json()
}

export const fetchZipHash = async function (scope: string, pkg: string, version: string): Promise<string> {
    const zipUrl = getDownloadUrl(scope, pkg, version)
    const zipHash = await checksumRemoteFile(zipUrl)
    return zipHash
}

export const fetchManifest = async function (scope: string, pkg: string, version: string): Promise<string> {
    const packageInfoUrl = `https://api.github.com/repos/${scope}/${pkg}/contents/Package.swift?ref=${version}`
    const response = await authFetch(packageInfoUrl)
    const fileMeta: IFileInfo = await response.json()

    return Buffer.from(fileMeta.content, 'base64').toString()
}

export const downloadZipFile = async function (scope: string, pkg: string, version: string): Promise<IZipBarFile> {
    const zipUrl = getDownloadUrl(scope, pkg, version)
    const response = await authFetch(zipUrl)

    return {
        url: zipUrl,
        fileStream: response.body,
    }
}

export const fetchIdentifiers = function (url: string | string[]) {
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

const authFetch = async (
    url: RequestInfo,
    headersInit: HeadersInit | undefined = undefined,
    bodyInit: BodyInit | undefined = undefined,
) => {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
            ...headersInit,
        },
        body: bodyInit,
    })

    if (!response.ok) {
        throw 'Github service error'
    }

    return response
}

const getDownloadUrl = function (scope: string, pkg: string, version: string): string {
    return `https://api.github.com/repos/${scope}/${pkg}/zipball/refs/tags/${version}`
}

const checksumRemoteFile = async function (remoteFile: string, hashName = 'sha256'): Promise<string> {
    const { body: stream } = await authFetch(remoteFile)

    return await new Promise((resolve, reject) => {
        const hash = crypto.createHash(hashName)
        stream.on('error', (err) => reject(err))
        stream.pipe(hash)
        stream.on('end', () => resolve(hash.digest('hex')))
    })
}
