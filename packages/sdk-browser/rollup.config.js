import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import visualizer from 'rollup-plugin-visualizer'
import define from 'rollup-plugin-define'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'
import gzipPlugin from 'rollup-plugin-gzip'
import cleaner from 'rollup-plugin-cleaner'
import generatePackageJson from 'rollup-plugin-generate-package-json'
import jscc from 'rollup-plugin-jscc'
import serve from 'rollup-plugin-serve'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'
import replace from '@rollup/plugin-replace'
import livereload from 'rollup-plugin-livereload'

const defaultPlugins = (feature, env) => {
  return [
    resolve(),
    commonjs(),
    jscc({
      values: { _FEATURES: feature },
    }),
    define({
      replacements: {
        'process.env.PACKAGE_VERSION': JSON.stringify(
          process.env.npm_package_version
        ),
        'process.env.NODE_ENV': JSON.stringify(env),
      },
    }),
  ]
}

const createConfig = ({ prod, stats, gzip, feature }) => {
  const name = `index${feature === 'full' ? '.full' : ''}${
    prod ? '.min' : ''
  }.js`

  const config = {
    input: './index.js',
    output: {
      name: 'BlotoutSDK',
      file: `dist/${name}`,
      format: 'umd',
      sourcemap: true,
    },
    plugins: defaultPlugins(feature, prod ? 'production' : 'development'),
  }

  if (gzip) {
    config.plugins.push(gzipPlugin())
  }

  if (prod) {
    config.plugins.push(terser())
  }

  if (stats) {
    config.plugins.push(
      visualizer({
        filename: `dist/stats${gzip ? '-gzip' : ''}.json`,
        json: true,
      })
    )
  }

  return config
}

const getDev = () => {
  return {
    input: './index.js',
    output: {
      name: 'BlotoutSDK',
      file: `dist/index.full.js`,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [...defaultPlugins('full', 'development')],
  }
}

const getDemo = (watch) => {
  return {
    input: 'demo/src/index.jsx',
    output: {
      file: 'dist/events.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins: [
      resolve({
        browser: true,
        jsnext: true,
        extensions: ['.js', '.jsx'],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        preventAssignment: true,
      }),
      babel({
        presets: ['@babel/preset-react'],
        babelHelpers: 'bundled',
      }),
      commonjs(),
      ...(watch
        ? [
            serve({
              verbose: true,
              contentBase: ['dist', 'demo/public'],
              port: 9000,
            }),
            livereload({ watch: 'dist' }),
          ]
        : [
            copy({
              targets: [{ src: 'demo/public/*', dest: './dist/' }],
            }),
          ]),
    ],
  }
}

module.exports = (commandLineArgs) => {
  delete pkg.devDependencies
  delete pkg.scripts

  if (commandLineArgs.watch || commandLineArgs.configDev) {
    return [getDev(commandLineArgs.watch), getDemo(commandLineArgs.watch)]
  }

  const prepare = {
    input: './index.js',
    plugins: [
      cleaner({
        targets: ['./dist/'],
      }),
      generatePackageJson({
        outputFolder: './dist/',
        baseContents: pkg,
      }),
      copy({
        targets: [
          { src: './README.md', dest: './dist/' },
          { src: './LICENSE', dest: './dist/' },
        ],
      }),
    ],
  }

  return [
    prepare,
    createConfig({
      feature: 'basic',
    }),
    createConfig({
      feature: 'basic',
      prod: true,
      stats: true,
    }),
    createConfig({
      feature: 'basic',
      prod: true,
      stats: true,
      gzip: true,
    }),
    createConfig({
      feature: 'full',
    }),
    createConfig({
      feature: 'full',
      prod: true,
      stats: true,
    }),
    createConfig({
      feature: 'full',
      prod: true,
      stats: true,
      gzip: true,
    }),
  ]
}
