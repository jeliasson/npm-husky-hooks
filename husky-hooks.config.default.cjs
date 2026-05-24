/** @type {import('@jeliasson/husky-hooks').Config} */

const config = {
  hooks: {
    'pre-commit': [
      'check-branch',
      'check-lock-files',
      ['run-cmd', 'echo Test'],
    ],

    'pre-push': [
      'check-branch',
      'check-lock-files',
      ['run-cmd', 'echo Test'],
    ],
  },

  settings: {
    /**
     * check-branch
     *
     * Check which git branch we're currently on, and abort if it's a
     * protected branch. This can be useful to make sure that commits stay
     * away from branches that only being used for Pull Requests or CI/CD.
     */
    'check-branch': {
      // Git branches that should be protected from accidental commit or push
      protectedBranches: ['main', 'dev'],
    },

    /**
     * check-lock-files
     *
     * Check for package manager lock files, and abort if any are present
     * lock file that we don't want. This is useful to ensure that e.g.
     * only package-lock.json is present in the repository.
     */
    'check-lock-files': {
      // Package manager lock file that should be present in the repository
      allowLockFile: 'package-lock.json',

      // Package manager lock files that should yield a abort
      denyLockFiles: ['yarn.lock', 'pnpm-lock.yaml'],
    },
  },
}

module.exports = config
