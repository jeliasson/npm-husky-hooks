# `@jeliasson/husky-hooks`

![NPM](https://img.shields.io/npm/l/@jeliasson/husky-hooks)
![npm bundle size](https://img.shields.io/bundlephobia/min/@jeliasson/husky-hooks)
![npm](https://img.shields.io/npm/v/@jeliasson/husky-hooks)
![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@jeliasson/husky-hooks)
![GitHub issues](https://img.shields.io/github/issues/jeliasson/husky-hooks)

This npm package aims to increase the developer experience and consistency by providing a set of hooks that can be opted-in the development lifecycle. It depends on [husky](https://www.npmjs.com/package/husky) for `pre-commit` and `pre-push` hooks, and a few other zero/low dependency packages.

> :warning: **Note**: This package is in development and comes with breaking changes, so move with caution.

- [Setup](#setup)
- [Hooks](#hooks)
    - [`check-branch`](#check-branch)
    - [`check-lock-files`](#check-lock-files)
    - [`run-cmd`](#run-cmd)
- [Other](#other)
- [Development](#development)
  - [Prerequisites](#prerequisites)
  - [Todo](#todo)
- [Contributing](#contributing)

## Setup

First, make sure you have [husky](https://www.npmjs.com/package/husky) installed. See installation [here](https://typicode.github.io/husky/#/?id=manual) or refer to below quick setup.

```bash
# Install husky dependency
npm install --save--dev husky

# Install husky
npx husky install
```

Once you have husky installed, let's proceed with setting up `@jeliasson/husky-hooks` and connect it with husky's `pre-commit` and `pre-push` hooks.

```bash
# Install dependency @jeliasson/husky-hooks
npm install -save--dev @jeliasson/husky-hooks

# Add package pre-commit hook
npx husky add .husky/pre-commit "npx @jeliasson/husky-hooks pre-commit"

# Add package pre-push hook
npx husky add .husky/pre-push "npx @jeliasson/husky-hooks pre-push"
```

Now to create a config file. `husky-hooks.config.js` will be placed in the root folder of the project.

```bash
# Create config
npx @jeliasson/husky-hooks create-config
```

Let's test it out and see if we get some magic ✨

```bash
# Make a new branch, create a test file, git add and commit
git checkout -b testing/jeliasson-husky-hooks
touch test.tmp && git add test.tmp
git commit -m "test(repo): keep calm and commit"
```

This should yield the following output...

```bash
Running hook test-sleep... ✅
Running hook check-branch... ✅
Running hook check-lock-files... ✅
Running hook run with argument 'echo Test'... ✅
```

...unless you have anything other than `package-lock.json` in your repo 😅

```bash
Running hook test-sleep... ✅
Running hook check-branch... ✅
Running hook check-lock-files... ❌

Invalid occurence of "yarn.lock" file. Remove it and only use "package-lock.json"
```

## Hooks

Hooks to run is defined in the configuration file `husky-hooks.config.js` that was created as part of the setup. Below is a table of available built-in hooks, followed by it's respective specific configuration. Future hooks may be created that require additional dev dependencies, not included in this package, but those will be marked.

| Name                                    | Description                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [`check-branch`](#check-branch)         | Check which git branch we're currently on, and abort if it's a protected branch.                 |
| [`check-lock-files`](#check-lock-files) | Check for package manager lock files, and abort if any are present lock file that we don't want. |
| [`run-cmd`](#run-cmd)                   | Run a ad-hoc command, and abort if the commands fails.                                           |

#### `check-branch`

Check which git branch we're currently on, and abort if it's a protected branch. This can be useful to make sure that commits stay away from branches that only being used for Pull Requests or CI/CD.

**Setup**

Add `check-branch` hook to `pre-commit` and/or `pre-push`.

```js
{
  hooks: {
    'pre-commit': [
      'check-branch', /* This line */
      ...
    ],

    'pre-push': [
      'check-branch', /* This line */
      ...
    ],
  },
}
```

**Settings**

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

Check for package manager lock files, and abort if any are present lock file that we don't want. This is useful to ensure that e.g. only `package-lock.json` is present in the repository.

**Setup**

Add `check-lock-files` hook to `pre-commit` and/or `pre-push`.

```js
{
  hooks: {
    'pre-commit': [
      'check-lock-files', /* This line */
      ...
    ],

    'pre-push': [
      'check-lock-files', /* This line */
      ...
    ],
  },
}
```

**Settings**

```js
{
  settings: {
    'check-lock-files': {
      // Package manager lock file that should be present in the repository
      allowLockFile: 'package-lock.json',

      // Package manager lock files that should yield a abort
      denyLockFiles: ['yarn.lock', 'pnpm-lock.yaml'],
    },
  }
}
```

#### `run-cmd`

Run a ad-hoc command, for example `npm run lint`, and abort if the commands fails. This can be useful if you have other commands, for exmaple in your husky hooks, that you want to run as part of this package.

> :warning: **Note**: Still figuring out the best approach to capture stdout/stderr and present them where appropriate. It works fine for now.

**Setup**

Add `run-cmd` hooks to `pre-commit` and/or `pre-push`. It should be shaped as an array where the first argument is `run-cmd` and the second argument would be the command to run, e.g. `npm run lint`. In below example we have two ad-hoc commands for each hook.

```js
{
  hooks: {
    'pre-commit': [
      ['run-cmd', 'echo This is a pre-commit hook via run-cmd'],
      ['run-cmd', 'npm run lint'],
      ...
    ],

    'pre-push': [
      ['run-cmd', 'echo This is a pre-push hook via run-cmd'],
      ['run-cmd', 'npm run lint'],
      ...
    ],
  },
}
```

## Other

**Print output**

Sometimes you may want to print the actual output of a hook, and passing `--stdout` will print the stdout of all hooks.

```bash
npx @jeliasson/husky-hooks pre-commit --stdout
```

## Development

### Prerequisites

- NodeJS >= 18.18.0
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
yarn link @jeliasson/husky-hooks
```

### Todo

See [Issues](https://github.com/jeliasson/npm-husky-hooks/issues)

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) ❤️
