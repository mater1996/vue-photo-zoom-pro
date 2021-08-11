/*
 * @author: Mater
 * @Email: bxh8640@gmail.com
 * @Date: 2021-08-09 16:56:22
 * @Description:
 */
const execa = require('execa')

const formats = ['iife']

async function build (format) {
  await execaRollup([['NODE_ENV', 'development'], ['FORMAT', format]])
}

const execaRollup = options => {
  return execa(
    'rollup',
    [
      '-c',
      '-w',
      './rollup.config.js',
      '--environment',
      options.map(v => v.join(':')).join(',')
    ],
    { stdio: 'inherit' }
  )
}

async function run () {
  for (const i of formats) {
    await build(i)
  }
}

run()
