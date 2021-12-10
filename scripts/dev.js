/*
 * @author: Mater
 * @Email: bxh8640@gmail.com
 * @Date: 2021-08-09 16:56:22
 * @Description:
 */
const glob = require('glob')
const loadConfigFile = require('rollup/dist/loadConfigFile')
const path = require('path')
const rollup = require('rollup')
const handler = require('serve-handler')
const http = require('http')

const formats = ['iife']
const configPath = path.resolve(__dirname, '../rollup.config.js')
let server

async function build (format) {
  await execaRollup([
    ['NODE_ENV', 'production'],
    ['FORMAT', format],
    ['NAME', 'vue-photo-zoom-pro'],
    ['GLOBAL', 'VuePhotoZoomPro'],
    ['INPUT', 'src/vue-photo-zoom-pro.vue']
  ])
}

async function buildPlugins (plugins, format) {
  for (const plugin of plugins) {
    const pluginName = path
      .dirname(plugin)
      .split('/')
      .pop()
    await execaRollup([
      ['NODE_ENV', 'production'],
      ['FORMAT', format],
      ['NAME', pluginName],
      [
        'GLOBAL',
        `VuePhotoZoomProPlugin${pluginName[0].toUpperCase() +
          pluginName.substr(1)}`
      ],
      ['INPUT', plugin]
    ])
  }
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
        {
          source: '/example/image/image',
          destination: '/example/image/image.dev.html'
        }
      ]
    })
  })
  server.listen(5000, () => {
    console.log('Running at http://localhost:5000')
  })
}

async function run () {
  const plugins = glob.sync('src/plugins/**/*.js')
  console.log(plugins)
  for (const i of formats) {
    await build(i)
    await buildPlugins(plugins, i)
  }
}

run()
