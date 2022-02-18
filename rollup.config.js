import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { uglify } from "rollup-plugin-uglify";

export default {
  input: 'src/index.ts',
  output: {
    file: 'build/index.js'
  },
  plugins: [
    nodeResolve(),
    uglify(),
    typescript({ tsconfig: './tsconfig.json', module: "ESNext" })
  ]
};