import typescript from 'rollup-plugin-typescript2'
import define from 'rollup-plugin-define'
import copy from 'rollup-plugin-copy'
import cleaner from 'rollup-plugin-cleaner'
import generatePackageJson from 'rollup-plugin-generate-package-json'
import pkg from './package.json'

module.exports = () => {
  delete pkg.devDependencies
  delete pkg.scripts

  return {
    input: './src/index.ts',
    output: [
      { file: `dist/${pkg.main}`, format: 'cjs', sourcemap: true },
      { file: `dist/${pkg.module}`, format: 'es', sourcemap: true },
    ],
    external: ['crypto-js/sha1', 'ua-parser-js', 'uuid'],
    plugins: [
      // code
      typescript({
        useTsconfigDeclarationDir: false,
      }),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
        },
      }),

      // skeleton
      cleaner({
        targets: ['./dist/'],
      }),
      generatePackageJson({
        outputFolder: './dist/',
        baseContents: pkg,
      }),
      copy({
        targets: [
          { src: './src/typings/index.d.ts', dest: './dist/' },
          { src: './README.md', dest: './dist/' },
          { src: './LICENSE', dest: './dist/' },
        ],
      }),
    ],
  }
}
