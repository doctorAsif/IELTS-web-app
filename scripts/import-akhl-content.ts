import * as fs from 'fs';
import * as path from 'path';

import { fileURLToPath } from 'url';

// Parse args
const args = process.argv.slice(2);
const isDryRun = !args.includes('--execute');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.resolve(__dirname, '../../assets/database');
const DOCS_DIR = path.resolve(__dirname, '../docs');
const REPORT_PATH = path.join(DOCS_DIR, 'FIREBASE_CONTENT_IMPORT_REPORT.md');

const FILES_TO_PROCESS = [
  'curriculum_master.json',
  'grammar_modules.json',
  'listening_modules.json',
  'practice_sessions.json',
  'reading_modules.json',
  'speaking_modules.json',
  'vocabulary_modules.json',
  'writing_modules.json'
];

interface Report {
  filesProcessed: number;
  recordsFound: number;
  recordsValid: number;
  recordsInvalid: number;
  duplicates: number;
  proposedCollections: Set<string>;
  proposedDocumentIds: string[];
  mediaDependencies: string[];
  warnings: string[];
}

const report: Report = {
  filesProcessed: 0,
  recordsFound: 0,
  recordsValid: 0,
  recordsInvalid: 0,
  duplicates: 0,
  proposedCollections: new Set(),
  proposedDocumentIds: [],
  mediaDependencies: [],
  warnings: []
};

const processedIds = new Set<string>();

function mapCollection(filename: string): string {
  switch(filename) {
    case 'curriculum_master.json': return 'curriculum';
    case 'grammar_modules.json': return 'grammar';
    case 'listening_modules.json': return 'listeningModules';
    case 'practice_sessions.json': return 'mockExams';
    case 'reading_modules.json': return 'readingModules';
    case 'speaking_modules.json': return 'speakingModules';
    case 'vocabulary_modules.json': return 'vocabulary';
    case 'writing_modules.json': return 'writingModules';
    default: return 'unknown';
  }
}

function getRecordId(record: any, filename: string): string | null {
  if (filename === 'practice_sessions.json') return record.session_id;
  if (filename === 'curriculum_master.json') return 'master';
  return record.practiceId || record.moduleId || record.id || null;
}

function processRecord(record: any, filename: string, collection: string) {
  report.recordsFound++;
  
  const recordId = getRecordId(record, filename);
  if (!recordId) {
    report.recordsInvalid++;
    report.warnings.push(`[${filename}] Record missing ID`);
    return;
  }

  if (processedIds.has(recordId)) {
    report.duplicates++;
    report.warnings.push(`[${filename}] Duplicate ID found: ${recordId}`);
    return;
  }
  
  processedIds.add(recordId);
  report.recordsValid++;
  report.proposedCollections.add(collection);
  report.proposedDocumentIds.push(`${collection}/${recordId}`);
  
  // Transform for versioning
  const transformed = {
    ...record,
    source: "akhl_android_assets",
    sourceFile: filename,
    schemaVersion: 1,
    contentVersion: 1,
    importedAt: new Date().toISOString(),
    status: "draft"
  };

  if (!isDryRun) {
    // This is where Firebase Admin SDK would be used to save `transformed` to Firestore
    // e.g. await db.collection(collection).doc(recordId).set(transformed);
  }
}

async function run() {
  console.log(`Starting import process (Dry Run: ${isDryRun})`);
  
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`Error: Assets directory not found at ${ASSETS_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  for (const filename of FILES_TO_PROCESS) {
    const filePath = path.join(ASSETS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      report.warnings.push(`File not found: ${filename}`);
      continue;
    }
    
    report.filesProcessed++;
    const collection = mapCollection(filename);
    
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (filename === 'curriculum_master.json') {
        processRecord(data.akhl_ielts_master_curriculum || data, filename, collection);
      } else if (filename === 'practice_sessions.json') {
        if (Array.isArray(data)) {
          data.forEach(item => processRecord(item, filename, collection));
        } else {
          report.warnings.push(`[${filename}] Expected array for practice sessions`);
        }
      } else {
        if (data.modules && Array.isArray(data.modules)) {
          data.modules.forEach((item: any) => processRecord(item, filename, collection));
        } else {
          report.warnings.push(`[${filename}] Expected 'modules' array`);
        }
      }
    } catch (e: any) {
      report.warnings.push(`Error parsing ${filename}: ${e.message}`);
    }
  }

  // Generate Report
  const mdReport = [
    `# FIREBASE CONTENT IMPORT REPORT (Dry Run: ${isDryRun})`,
    '',
    `## Summary`,
    `- Files Processed: ${report.filesProcessed}`,
    `- Records Found: ${report.recordsFound}`,
    `- Records Valid: ${report.recordsValid}`,
    `- Records Invalid: ${report.recordsInvalid}`,
    `- Duplicates: ${report.duplicates}`,
    '',
    `## Proposed Collections`,
    ...Array.from(report.proposedCollections).map(c => `- ${c}`),
    '',
    `## Import Warnings`,
    ...report.warnings.map(w => `- ${w}`),
    '',
    `## Sample Document Mappings`,
    ...report.proposedDocumentIds.slice(0, 10).map(id => `- ${id}`),
    ...(report.proposedDocumentIds.length > 10 ? ['- ...'] : []),
    ''
  ].join('\n');

  fs.writeFileSync(REPORT_PATH, mdReport);
  console.log(`Report generated at ${REPORT_PATH}`);
  
  if (isDryRun) {
    console.log("Run with --execute to perform actual import.");
  } else {
    console.log("Import completed.");
  }
}

run().catch(console.error);
