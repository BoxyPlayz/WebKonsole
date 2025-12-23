import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

export default defineConfig({
	tsconfig: true,
	input: 'src/frontend.ts',
	plugins: [dts()],
	output: { dir: 'build/', format: 'esm', minify: false },
});
