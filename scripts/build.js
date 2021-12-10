/*
 * @author: Mater
 * @Email: bxh8640@gmail.com
 * @Date: 2021-08-09 16:56:18
 * @Description:
 */
const path = require('path')
const execa = require('execa')
const glob = require('glob')

const formats = ['cjs', 'esm', 'iife']

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
  return execa(
    'rollup',
    [
      '-c',
      './rollup.config.js',
      '--environment',
      environment.map(v => v.join(':')).join(',')
    ],
    { stdio: 'inherit' }
  )
}

async function run () {
  const plugins = glob.sync('src/plugins/**/*.js')
  for (const i of formats) {
    await build(i)
    await buildPlugins(plugins, i)
  }
}

run()
