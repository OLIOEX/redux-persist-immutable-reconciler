# redux-persist-immutable-reconciler

[![CI](https://github.com/OLIOEX/redux-persist-immutable-reconciler/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/OLIOEX/redux-persist-immutable-reconciler/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@olioex/redux-persist-immutable-reconciler)](https://www.npmjs.com/package/@olioex/redux-persist-immutable-reconciler)

A [redux-persist](https://github.com/rt2zz/redux-persist) state reconciler that deep-merges persisted state into [Immutable.js](https://immutable-js.com/) state.

The built-in reconcilers (`autoMergeLevel1`, `autoMergeLevel2`) replace or shallow-merge each top-level key. If your slices are Immutable `Map`s and you only persist part of them (for example with [redux-persist-transform-filter-immutable](https://github.com/actra-development-oss/redux-persist-transform-filter-immutable)), a shallow merge throws away the parts you didn't persist. This reconciler calls `mergeDeep`, so persisted values are layered on top of your reducer's initial state.

## Installation

```sh
npm install @olioex/redux-persist-immutable-reconciler immutable@^3.8
```

Requires Immutable.js 3.x.

## Usage

Pass it as the `stateReconciler` in your persist config:

```js
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeImmutable from "@olioex/redux-persist-immutable-reconciler";

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeImmutable,
};

export default persistReducer(persistConfig, rootReducer);
```

### Example

Initial state from your reducer:

```js
{
  users: fromJS({
    data: { 1000: { id: 1000 } },
    settings: { filters: { current: { filter1: false, filter2: 1 } } },
  }),
}
```

Persisted (inbound) state, where only `settings` was saved:

```js
{
  users: { settings: { filters: { current: { filter1: true, filter2: 2 } } } },
}
```

Result after rehydration. `data` is kept and `settings` is restored:

```js
{
  users: fromJS({
    data: { 1000: { id: 1000 } },
    settings: { filters: { current: { filter1: true, filter2: 2 } } },
  }),
}
```

## How it works

For each top-level key in the persisted state (`_persist` is skipped):

- **If the reducer has already changed that key** during the `REHYDRATE` action (it is no longer the same reference as in the original state), it is left alone, so your reducer's changes win.
- **If the current value is an Immutable collection**, the persisted value is deep-merged into it with `mergeDeep`. Plain JS persisted values are converted with `fromJS` first, so it works whether or not your persist transforms re-hydrate to Immutable.
- **Otherwise**, the persisted value replaces the current one.

If `debug: true` is set in your persist config, each decision is logged to the console. Nothing is logged when `NODE_ENV` is `production`.

## Notes

- The package ships its untranspiled source (ES modules plus [Flow](https://flow.org/) type annotations), so your bundler has to run it through Babel. React Native's Metro and most Babel-based setups already do this.
- Adapted from [this gist](https://gist.github.com/appelstroop/2e2ac063640b362aab612f6085cb1e7e) by appelstroop.

## Development

```sh
npm ci
npm test      # Jest
npm run flow  # Flow type check
```

## Releasing

Releases are published to npm by the [Publish workflow](.github/workflows/publish.yml) when a `v*` tag is pushed. It uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers), so no npm token is needed.

1. On an up-to-date `master`, bump the version with `npm version <patch|minor|major>`. This commits the change and creates the `vX.Y.Z` tag.
2. Push the commit and tag: `git push --follow-tags`.
3. Watch the workflow in the Actions tab. It fails if the tag doesn't match `package.json`.

## License

[MIT](LICENSE)
