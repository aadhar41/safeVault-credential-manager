import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: './',
    root: '.',               // default – project root
    publicDir: 'public',    // optional, if you have static assets
});