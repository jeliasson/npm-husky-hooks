const config = {
  hooks: {
    'pre-commit': [
      ['run-cmd', 'npm run lint'],
      ['run-cmd', 'npm run format'],
      'check-branch',
      'check-lock-files',
    ],

    'pre-push': [
      ['run-cmd', 'tsc'],
      ['run-cmd', 'npm run lint'],
      'check-branch',
      'check-lock-files',
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
      protectedBranches: ['main'],
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

    /**
     * test-sleep
     *
     * This is a dummy hook for demo purposes. It sleeps for 1000 seconds
     * before continuing to next hook.
     */
    'test-sleep': {
      // How long should the hook sleep for
      delay: 1000,
    },
  },
}

module.exports = config
