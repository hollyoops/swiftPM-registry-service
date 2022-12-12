export interface IPackageRelease {
    url: string
}

export type IPackageReleases = { [key: string]: IPackageRelease }

export interface IGithubTag {
    name: string
}
