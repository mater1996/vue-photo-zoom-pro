const path = require('path')
const peerDepsExternal = require('rollup-plugin-peer-deps-external')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const vue = require('rollup-plugin-vue')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const { terser } = require('rollup-plugin-terser')
const replace = require('@rollup/plugin-replace')

function parseEnvironment (environment) {
  return Object.fromEntries(environment.split(',').map(v => v.split(':')))
}

module.exports = ({ environment }) => {
  const {
    NODE_ENV,
    FORMAT,
    NAME: name,
    GLOBAL: global,
    INPUT: input
  } = parseEnvironment(environment)
  const isProd = NODE_ENV === 'production'
  const isIIFE = FORMAT === 'iife'
  const resolve = path.resolve
  const resolveDir = p => resolve(__dirname, p)
  const resolveOutput = p => resolve(resolveDir('dist'), p)

  const FORMAT_OPTIONS = {
    cjs: {
      name: global,
      format: 'cjs',
      file: resolveOutput(`${name}.js`)
    },
    esm: {
      name: global,
      format: 'esm',
      file: resolveOutput(`${name}.esm.js`)
    },
    iife: {
      name: global,
      format: 'iife',
      file: resolveOutput(`${name}.global.js`)
    }
  }
  return {
    input: input,
    output: FORMAT_OPTIONS[FORMAT],
    treeshake: isProd,
    plugins: [
      !isIIFE &&
        peerDepsExternal({
          includeDependencies: true
        }),
      replace({
        preventAssignment: true,
        values: { 'process.env.NODE_ENV': JSON.stringify(NODE_ENV) }
      }),
      commonjs(),
      vue({
        css: !isProd,
        normalizer: '~vue-runtime-helpers/dist/normalize-component.js'
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: true
      }),
      babel({
        babelrc: true,
        runtimeHelpers: true,
        extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue']
      }),
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
        extract: resolveOutput(`style/${name}.css`),
        minimize: isProd,
        sourceMap: false,
        modules: false,
        plugins: [require('autoprefixer')]
      })
    ]
  }
}
