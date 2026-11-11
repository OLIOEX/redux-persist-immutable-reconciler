# redux-persist-immutable-reconciler

### State reconciler for deep merging immutable state

[![CI](https://github.com/OLIOEX/redux-persist-immutable-reconciler/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/OLIOEX/redux-persist-immutable-reconciler/actions/workflows/ci.yml)

Implemented to work with [redux-persist-transform-filter-immutable](https://github.com/actra-development-oss/redux-persist-transform-filter-immutable)

Adapted from [this gist](https://gist.github.com/appelstroop/2e2ac063640b362aab612f6085cb1e7e) by appelstroop.

## Releasing

Releases are published to npm by the [Publish workflow](.github/workflows/publish.yml) when a `v*` tag is pushed. It uses npm trusted publishing, so no npm token is needed.

1. On an up-to-date `master`, bump the version: `npm version <patch|minor|major>` (this commits and creates the `vX.Y.Z` tag).
2. Push the commit and tag: `git push --follow-tags`.
3. Watch the workflow in the Actions tab. It fails if the tag doesn't match `package.json`.
