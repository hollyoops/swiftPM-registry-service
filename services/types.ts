export interface IPackageRelease {
    url: string
}

export type IPackageReleases = { [key: string]: IPackageRelease }

export interface IGithubTag {
    name: string
}

export interface IFileInfo {
    content: string
}

export interface IZipBarFile {
    url: string
    fileStream: NodeJS.ReadableStream
}
