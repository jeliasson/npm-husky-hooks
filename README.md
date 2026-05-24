# `@jeliasson/husky-hooks`

![NPM](https://img.shields.io/npm/l/@jeliasson/husky-hooks)
![npm bundle size](https://img.shields.io/bundlephobia/min/@jeliasson/husky-hooks)
![npm](https://img.shields.io/npm/v/@jeliasson/husky-hooks)
![GitHub issues](https://img.shields.io/github/issues/jeliasson/husky-hooks)

A set of configurable git hooks for [husky](https://www.npmjs.com/package/husky) that help enforce consistency and best practices across your development workflow. Supports any git hook — `pre-commit`, `pre-push`, `commit-msg`, `post-merge`, and more.

- [Setup](#setup)
- [Hooks](#hooks)
  - [`check-branch`](#check-branch)
  - [`check-lock-files`](#check-lock-files)
  - [`run-cmd`](#run-cmd)
- [CLI](#cli)
- [Development](#development)
- [Contributing](#contributing)

## Setup

First, make sure you have [husky](https://www.npmjs.com/package/husky) installed. See the [husky documentation](https://typicode.github.io/husky/) or refer to the quick setup below.

```bash
# Install husky
npm install --save-dev husky

# Initialize husky
npx husky init
```

Once husky is set up, install `@jeliasson/husky-hooks` and connect it to your git hooks.

```bash
# Install @jeliasson/husky-hooks
npm install --save-dev @jeliasson/husky-hooks

# Set up pre-commit hook
echo "npx @jeliasson/husky-hooks pre-commit" > .husky/pre-commit

# Set up pre-push hook
echo "npx @jeliasson/husky-hooks pre-push" > .husky/pre-push
```

Create a config file. `husky-hooks.config.cjs` will be placed in the root folder of the project.

```bash
npx @jeliasson/husky-hooks create-config
```

Test it out — make a new branch, create a test file, and commit:

```bash
git checkout -b testing/jeliasson-husky-hooks
touch test.tmp && git add test.tmp
git commit -m "test(repo): keep calm and commit"
```

This should yield the following output:

```
Running hook test-sleep... OK
Running hook check-branch... OK
Running hook check-lock-files... OK
Running hook run-cmd with argument 'echo Test'... OK
```

Unless you have a denied lock file in your repo:

```
Running hook test-sleep... OK
Running hook check-branch... OK
Running hook check-lock-files... FAIL

Invalid occurrence of "yarn.lock" file. Please remove it and only use "package-lock.json"
```

## Hooks

Hooks are defined in the configuration file `husky-hooks.config.cjs`. You can assign them to any git hook event (`pre-commit`, `pre-push`, `commit-msg`, `post-merge`, etc.).

| Name                                    | Description                                               |
| --------------------------------------- | --------------------------------------------------------- |
| [`check-branch`](#check-branch)         | Abort if the current git branch is protected.             |
| [`check-lock-files`](#check-lock-files) | Abort if unwanted package manager lock files are present. |
| [`run-cmd`](#run-cmd)                   | Run an ad-hoc command and abort if it fails.              |

#### `check-branch`

Check which git branch you're currently on, and abort if it's a protected branch. Useful for preventing accidental commits to branches reserved for pull requests or CI/CD.

**Setup**

Add `check-branch` to the desired hook events in your config:

```js
{
  hooks: {
    'pre-commit': [
      'check-branch',
    ],
    'pre-push': [
      'check-branch',
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

Check for unwanted package manager lock files and abort if any are found. Useful for ensuring that only one package manager is used across the project.

**Setup**

Add `check-lock-files` to the desired hook events in your config:

```js
{
  hooks: {
    'pre-commit': [
      'check-lock-files',
    ],
    'pre-push': [
      'check-lock-files',
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

      // Package manager lock files that should cause an abort
      denyLockFiles: ['yarn.lock', 'pnpm-lock.yaml'],
    },
  }
}
```

#### `run-cmd`

Run an ad-hoc command (e.g. `npm run lint`) and abort if it fails. Useful for integrating additional checks into your hook pipeline.

**Setup**

Add `run-cmd` as a tuple where the first element is `run-cmd` and the second is the command to execute:

```js
{
  hooks: {
    'pre-commit': [
      ['run-cmd', 'npm run lint'],
      ['run-cmd', 'npm run format -- --check'],
    ],
    'pre-push': [
      ['run-cmd', 'npm run test'],
    ],
  },
}
```

## CLI

```bash
# Create a config file
npx @jeliasson/husky-hooks create-config

# Overwrite an existing config file
npx @jeliasson/husky-hooks create-config --force

# Run hooks for a git event
npx @jeliasson/husky-hooks pre-commit

# Run hooks and print stdout from each hook
npx @jeliasson/husky-hooks pre-commit --stdout

# Print version
npx @jeliasson/husky-hooks --version

# Print help
npx @jeliasson/husky-hooks --help
```

## Development

### Prerequisites

- Node.js >= 22.16.0
- npm >= 10.8.2

```bash
# Link the package locally
npm link

# Start TypeScript watch mode
npm run dev

# Run tests
npm run test
```

From a test project, link the local package:

```bash
npm link @jeliasson/husky-hooks
```

### Issues

See [Issues](https://github.com/jeliasson/npm-husky-hooks/issues)

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md)
