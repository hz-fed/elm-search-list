import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.js',
      formats: ['es'],
      fileName: `index`
    },
    rollupOptions: {
      external: ['element-ui', 'vue', 'element-ui/lib/theme-chalk/index.css']
    }
  }
});
