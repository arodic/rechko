// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    file: 'build/index.js'
  },
  plugins: [
    nodeResolve(),
    typescript({ tsconfig: './tsconfig.json', module: "ESNext" })
  ]
};