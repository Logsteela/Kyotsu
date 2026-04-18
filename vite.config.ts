import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

// 開発環境でPDFとMP3ファイルへのアクセスをリライトするプラグイン
function pdfRewritePlugin(): Plugin {
  return {
    name: 'pdf-rewrite',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          // PDFまたはMP3ファイルへのリクエストで、まだ/pdfs/で始まっていない場合
          if ((req.url.endsWith('.pdf') || req.url.endsWith('.mp3')) && !req.url.startsWith('/pdfs/')) {
            // /pdfs/ を追加してリライト
            req.url = '/pdfs' + req.url
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    pdfRewritePlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
})