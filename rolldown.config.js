import { defineConfig } from 'rolldown';

export default defineConfig({
  tsconfig: true,
  input: 'src/Konsole.js',
  output: {
    file: 'build/konsole.js',
    format: 'umd',
    minify: true
  },
});