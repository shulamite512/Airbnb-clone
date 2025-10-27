import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Enhanced logging - shows info, warnings, and errors in console
  logLevel: 'info', // 'info' | 'warn' | 'error' | 'silent'

  // Keep console history visible (don't clear on rebuild)
  clearScreen: false,

  plugins: [react()],

  // Server configuration for better error reporting
  server: {
    // HMR error overlay in browser
    hmr: {
      overlay: true, // Shows errors as overlay in browser
    },
  },

  // Build configuration for debugging
  build: {
    // Generate source maps for better error stack traces
    sourcemap: true,
    // Show compressed size in build output
    reportCompressedSize: true,
  },
})
