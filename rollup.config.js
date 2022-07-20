import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'index.ts',
    output:[
      {
        file: 'lib/bundle.cjs.js',
        format: 'cjs',
      },
      {
        file: 'lib/bundle.es.js',
        format: 'es',
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      json(),
      // terser(),
    ]
  },
  {
    input: 'index.ts',
    plugins: [dts()],
    output: {
        format: 'esm',
        file: 'lib/bundle.d.ts',
    },
  }
]