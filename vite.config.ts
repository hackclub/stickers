import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:9292',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			},
			'/auth': {
				target: 'http://localhost:9292',
				changeOrigin: true
			}
		}
	}
});
