# SwiftPM registry service

A lightweight swiftPM registry service write by Node. Current this package registry only support for Github packages.

## What is SwiftPM registry Service

SwiftPM registry Service is a standard web service interface that it can also use to download dependencies from a package registry. You can use the service to download remote packages with `package-registry` commands.

You use service with Jfrog as a remote Jfrog smart repository to download and cache github swift packages.

Current service is deploy to: [spm-registry-service.onrender.com](https://spm-registry-service.onrender.com).

## Requirements

-   Xcode 14.1+
-   Node JS

## How to use？

1. Setup the swift registry

```bash
swift package-registry set https://spm-registry-service.onrender.com
```

2. Change the dependencies

```swift
dependencies: [
    // instead of .package(url: "https://github.com/Moya/Moya.git", from: "1.1.0")
   .package(id: "moya.moya", from: "1.1.0")),
   .package(id: "hollyoops.RecoilSwift", exact: "2.0.0")
]
```

3. Resolve dependencies

```swift
swift package resolve
```

## Run local

```bash
pnpm i

set GITHUB_ACCESS_TOKEN="Your github token" && pnpm start
```

Then the service run on 3001 port

## Reference:

-   [Swift registry service](https://github.com/apple/swift-evolution/blob/main/proposals/0292-package-registry-service.md)
-   [Jfrog swift registry](https://www.jfrog.com/confluence/display/JFROG/Swift+Registry)
