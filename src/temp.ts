// async function entry() {
//   const args = process.argv.slice(2)
//   const command = args[0]
//   const run = COMMANDS[command]

//   if (run) {
//     process.stdout.write(`Running "${command}"... `)
//     const response = await run()

//     process.stdout.write(response.errors.length === 0 ? '✅' : '❌')
//     console.log()

//     // Handle errors
//     if (response.errors.length > 0) {
//       console.log()
//       response.errors.forEach((e) => console.log(`${e}`))
//       process.exit(1)
//     }

//     // Default exit code
//     process.exit(0)
//   } else {
//     console.log(`Usage: yarn husky-test <command>`)
//   }
// }