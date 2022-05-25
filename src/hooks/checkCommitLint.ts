// import { ThookResponse } from '../types'

// export async function checkCommitLint(): Promise<ThookResponse> {
//   const stdout: string[] = []
//   const errors: string[] = []

//   const gitMessage = require('child_process')
//     .execSync('git log -1 --no-merges')
//     .toString()
//     .trim()

//   const { types, scopes } = require('../../.cz-config.js')

//   const allowedTypes = types.map((type) => type.value)
//   const allowedScopes = scopes.map((scope) => scope.name)

//   const commitMsg = `(${allowedTypes.join('|')})\\((${allowedScopes.join(
//     '|'
//   )})\\):\\s(([a-z0-9:\-\s])+)`

//   const matchCommit = new RegExp(commitMsg, 'g').test(gitMessage)
//   const matchRevert = /Revert/gi.test(gitMessage)
//   const matchRelease = /Release/gi.test(gitMessage)
//   const exitCode = +!(matchRelease || matchRevert || matchCommit)

//   if (exitCode !== 0) {
//     errors.push(
//       '[Error]: Oh no! 😦 Your commit message: \n' +
//         '-------------------------------------------------------------------\n' +
//         gitMessage +
//         '\n-------------------------------------------------------------------' +
//         '\n\n 👉️ Does not follow the commit message convention specified in the CONTRIBUTING.MD file.'
//     )
//     errors.push('\ntype(scope): subject \n BLANK LINE \n body')
//     errors.push('\n')
//     errors.push(`possible types: ${allowedTypes.join('|')}`)
//     errors.push(
//       `possible scopes: ${allowedScopes.join('|')} (if unsure use "core")`
//     )
//     errors.push('\nEXAMPLE: \n' + 'fix(ci): adding required env variable\n')
//   }

//   return { stdout, errors }
// }
