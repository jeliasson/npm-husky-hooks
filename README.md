# `@jeliasson/husky-hooks`

This npm package aims to increase the developer experience and consistancy by providing a set of hooks that can be opted-in the development lifecycle. It depends on [husky](https://www.npmjs.com/package/husky) for `pre-commit` and `pre-push` hooks, and a few other zero/low dependency packages.

> :warning: **Note**: This package is in development so please move with caution.

- [Setup](#setup)
- [Hooks](#hooks)
    - [`check-branch`](#check-branch)
    - [`check-lock-files`](#check-lock-files)
- [Other](#other)
  - [Print output](#print-output)
  - [Recipies](#recipies)
- [Development](#development)
  - [Prerequsites](#prerequsites)
  - [Todo](#todo)
- [Contributing](#contributing)

## Setup

First, make sure you have [husky](https://www.npmjs.com/package/husky) installed. See installation [here](https://typicode.github.io/husky/#/?id=manual) or refer to below quick setup.

```bash
# Install husky dependency
yarn add --dev husky

# Install husky
yarn husky install
```

Once you have husky installed, let's proceed with setting up `@jeliasson/husky-hooks` and connect it with husky's `pre-commit` and `pre-push` hooks.

```
# Install dependency @jeliasson/husky-hooks
yarn add --dev @jeliasson/husky-hooks

# Add package pre-commit hook
npx husky add .husky/pre-commit "npx @jeliasson/husky-hooks pre-commit"

# Add package pre-commit hook
npx husky add .husky/pre-push "npx @jeliasson/husky-hooks pre-push"

# Make a commit test
touch test.tmp
git add test.tmp
git commit -m "Keep calm and commit"
```

## Hooks

Hooks to run is defined in the configuration file `husky-hooks.config.js` that was created as part of the setup. Below is a table of available built-in hooks, followed by it's respective specific configuration. Future hooks may be created that require additional dev dependencies, not included in this package, but those will be marked.

| Name                                    | Description                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [`check-branch`](#check-branch)         | Check which git branch we're currently on, and abort if it's a protected branch.                 |
| [`check-lock-files`](#check-lock-files) | Check for package manager lock files, and abort if any are present lock file that we don't want. |

#### `check-branch`

Check which git branch we're currently on, and abort if it's a protected branch. This can be useful to make sure that commits stay away from branches that only being used for Pull Requests or CI/CD.

**Setup**

Add `check-branch` hook to `pre-commit` and/or `pre-push`.

**Config**

```js
{
  settings: {
    'check-branch': {
      // Git branches that should be protected from accidental commit or push
      protectedBranches: ['main', 'dev'],
    },
  }
}
```

#### `check-lock-files`

Check for package manager lock files, and abort if any are present lock file that we don't want. This is useful to ensure that e.g. only`yarn.lock` is present in the repository.

**Setup**

Add `check-lock-files` hook to `pre-commit` and/or `pre-push`.

**Config**

```js
{
  settings: {
    'check-lock-files': {
      // Package manager lock file that should be present in the repository
      allowLockFile: 'yarn.lock',

      // Package manager lock files that should yield a abort
      denyLockFiles: ['package-lock.json', 'pnpm-lock.yaml'],
    },
  }
}
```

## Other

### Print output

Sometimes you may want to the stdout of the hook ...

```
npx @jeliasson/husky-hooks pre-commit --stdout
```

### Recipies

**Test**
**Make sure we don't push to protected branches**

```
npx husky add .husky/pre-push "npx @jeliasson/husky-hooks check-branch"
```

**Make sure we don't push to protected branches**

```
npx husky add .husky/pre-push "npx @jeliasson/husky-hooks check-branch"
```

## Development

### Prerequsites

- NodeJS >= 14
- yarn

From the package directory, run

```bash
yarn link
```

Start tsc watch

```bash
yarn dev
```

From the test project directory, run

```bash
yarn link husky-hooks
```

### Todo

- [ ] Move this to GitHub Issues
- [ ] Use this package in the development
- [ ] Make stable
- [ ] Write tests
- [ ] CI/CD for testing
- [ ] Use [zod](https://www.npmjs.com/package/zod) for configuration parsing
- [ ] Add [cz-cli](https://github.com/commitizen/cz-cli) as 3rd party
- [ ] Replace yargs with [clipanion](https://www.npmjs.com/package/clipanion)
- [ ] 🚀

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) ❤️

```

```
