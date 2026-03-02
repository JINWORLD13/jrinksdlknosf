/**
 * Vite 빌드 직후 index.html을 백업하는 스크립트
 * react-spa-prerender가 index.html을 덮어쓸 수 있으므로 원본을 보존
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');
const backupPath = path.join(distPath, 'index.html.vite-backup');

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, backupPath);
  console.log('Backed up index.html to index.html.vite-backup');
} else {
  console.warn('index.html not found. Make sure Vite build completed successfully.');
  process.exit(1);
}

