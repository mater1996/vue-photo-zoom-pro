const path = require('path')
const peerDepsExternal = require('rollup-plugin-peer-deps-external')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const vue = require('rollup-plugin-vue')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const { terser } = require('rollup-plugin-terser')
const replace = require('@rollup/plugin-replace')
const { name } = require('./package.json')

function parseEnvironment (environment) {
  return Object.fromEntries(environment.split(',').map(v => v.split(':')))
}

module.exports = ({ environment }) => {
  const { NODE_ENV, FORMAT } = parseEnvironment(environment)
  const isProd = NODE_ENV === 'production'
  const isESM = FORMAT === 'esm'
  const isIIFE = FORMAT === 'iife'
  const resolve = path.resolve
  const resolveDir = p => resolve(__dirname, p)
  const resolveOutput = p => resolve(resolveDir('dist'), p)

  const babelConfig = {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: 'auto',
          useBuiltIns: 'usage',
          corejs: 3
        }
      ]
    ],
    plugins: [
      ['@babel/plugin-transform-runtime'],
      ['@babel/plugin-proposal-class-properties']
    ],
    externalHelpers: false,
    runtimeHelpers: true,
    exclude: 'node_modules/**'
  }

  const FORMAT_OPTIONS = {
    cjs: {
      name: 'VuePhotoZoomPro',
      format: 'cjs',
      file: resolveOutput(`${name}.js`),
      exports: 'default'
    },
    esm: {
      name: 'VuePhotoZoomPro',
      format: 'esm',
      file: resolveOutput(`${name}.esm.js`)
    },
    iife: {
      name: 'VuePhotoZoomPro',
      format: 'iife',
      file: resolveOutput(`${name}.global.js`)
    }
  }
  return {
    input: 'src/vue-photo-zoom-pro.vue',
    output: FORMAT_OPTIONS[FORMAT],
    treeshake: isProd,
    plugins: [
      peerDepsExternal(),
      replace({
        preventAssignment: true,
        values: { 'process.env.NODE_ENV': JSON.stringify(NODE_ENV) }
      }),
      vue({}),
      nodeResolve({
        browser: true,
        preferBuiltins: true
      }),
      commonjs(),
      !isESM && babel(babelConfig),
      isIIFE &&
        isProd &&
        terser({
          format: {
            safari10: isProd,
            preserve_annotations: true
          },
          compress: {
            drop_console: isProd,
            ecma: 2015,
            pure_getters: true
          }
        }),
      postcss({
        extract: true,
        minimize: isProd,
        sourceMap: !isProd,
        modules: false,
        plugins: [require('autoprefixer')]
      })
    ]
  }
}
