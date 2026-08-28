import { test } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Import AKHL Content Script', () => {
  const scriptPath = path.resolve(__dirname, 'import-akhl-content.ts');
  const reportPath = path.resolve(__dirname, '../docs/FIREBASE_CONTENT_IMPORT_REPORT.md');

  if (fs.existsSync(reportPath)) {
    fs.unlinkSync(reportPath);
  }
  
  assert.strictEqual(fs.existsSync(reportPath), false);

  // Run the script using tsx
  execSync(`npx -y tsx "${scriptPath}" --dry-run`);

  assert.strictEqual(fs.existsSync(reportPath), true);
  
  const reportContent = fs.readFileSync(reportPath, 'utf8');
  assert.ok(reportContent.includes('FIREBASE_CONTENT_IMPORT_REPORT'));
  assert.ok(reportContent.includes('Files Processed:'));
  assert.ok(reportContent.includes('Records Found:'));
});
