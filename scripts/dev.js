/*
 * @author: Mater
 * @Email: bxh8640@gmail.com
 * @Date: 2021-08-09 16:56:22
 * @Description:
 */
const loadConfigFile = require('rollup/dist/loadConfigFile')
const path = require('path')
const rollup = require('rollup')
const handler = require('serve-handler')
const http = require('http')

const formats = ['iife']
const configPath = path.resolve(__dirname, '../rollup.config.js')
let server

async function build (format) {
  execaRollup([['NODE_ENV', 'development'], ['FORMAT', format]])
}

const execaRollup = environment => {
  return loadConfigFile(configPath, {
    environment: environment.map(v => v.join(':')).join(',')
  }).then(async ({ options, warnings }) => {
    warnings.flush()
    for (const optionsObj of options) {
      const bundle = await rollup.rollup(optionsObj)
      await Promise.all(optionsObj.output.map(bundle.write))
    }
    const watcher = rollup.watch(options)
    watcher.on('event', ({ result }) => {
      if (result) {
        console.clear()
        console.log('rollup build success, watching...')
        if (!server) {
          createServer()
        }
        result.close()
      }
    })
  })
}

function createServer () {
  server = http.createServer((request, response) => {
    return handler(request, response, {
      rewrites: [
        { source: '/example/image/image', destination: '/example/image/image.dev.html' }
      ]
    })
  })
  server.listen(5000, () => {
    console.log('Running at http://localhost:5000')
  })
}

async function run () {
  for (const i of formats) {
    await build(i)
  }
}

run()
