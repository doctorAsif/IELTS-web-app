import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Make sure to set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// pointing to your service account key file before running this script.
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Android assets database
const ANDROID_ASSETS_DIR = path.resolve(__dirname, '../../AKHL IELTS android app/assets/database');

// Dry run flag - set to false to actually write to Firestore
const DRY_RUN = process.env.DRY_RUN !== 'false';

console.log(`Starting Android Content Import (DRY_RUN=${DRY_RUN})...`);

interface MigrationRecord {
  schemaVersion: string;
  contentVersion: number;
  source: string;
  importedAt: string;
  originalFile: string;
  status: string;
}

const baseMigrationRecord = (filename: string): MigrationRecord => ({
  schemaVersion: '1.0',
  contentVersion: 1,
  source: 'akhl_android_assets',
  importedAt: new Date().toISOString(),
  originalFile: filename,
  status: 'draft',
});

// Helper to determine the ID of a document
const getDocId = (doc: any, prefix: string, index: number): string => {
  if (doc.practiceId) return doc.practiceId;
  if (doc.id) return doc.id;
  if (doc.session_id) return doc.session_id;
  if (doc.stage) return `stage-${doc.stage.replace(/\s+/g, '-').toLowerCase()}`;
  return `${prefix}-${index}`;
};

async function importCollection(
  filename: string,
  targetCollection: string,
  extractArray: (data: any) => any[],
  additionalTags: Record<string, any> = {}
) {
  const filePath = path.join(ANDROID_ASSETS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  let jsonData;
  try {
    jsonData = JSON.parse(rawData);
  } catch (err) {
    console.error(`Error parsing JSON for ${filename}:`, err);
    return;
  }

  const items = extractArray(jsonData);
  if (!Array.isArray(items)) {
    console.error(`Extracted data for ${filename} is not an array!`);
    return;
  }

  console.log(`\nProcessing ${filename} -> ${targetCollection} (${items.length} items)...`);
  
  let addedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const docId = getDocId(item, filename.split('.')[0], i);
    const docRef = db.collection(targetCollection).doc(docId);
    
    // Check for duplicate
    const existing = await docRef.get();
    if (existing.exists) {
      // console.log(`Skipping existing document: ${docId}`);
      skippedCount++;
      continue;
    }

    const payload = {
      ...item,
      ...additionalTags,
      ...baseMigrationRecord(filename)
    };

    if (!DRY_RUN) {
      await docRef.set(payload);
    }
    addedCount++;
  }

  console.log(`Completed ${filename}: Added ${addedCount}, Skipped (Duplicates) ${skippedCount}`);
}

async function run() {
  try {
    // 1. Curriculum
    await importCollection(
      'curriculum_master.json',
      'curriculum',
      (data) => data.akhl_ielts_master_curriculum?.executive_curriculum_map || []
    );

    // 2. Grammar
    await importCollection(
      'grammar_modules.json',
      'grammar',
      (data) => data.modules || []
    );

    // 3. Vocabulary
    await importCollection(
      'vocabulary_modules.json',
      'vocabulary',
      (data) => data.modules || []
    );

    // 4. Practice Sessions (Mock Exams)
    await importCollection(
      'practice_sessions.json',
      'mockExams',
      (data) => data || []
    );

    // 5. Practice Items (Listening)
    await importCollection(
      'listening_modules.json',
      'practiceItems',
      (data) => data.modules || [],
      { skill: 'Listening' }
    );

    // 6. Practice Items (Reading)
    await importCollection(
      'reading_modules.json',
      'practiceItems',
      (data) => data.modules || [],
      { skill: 'Reading' }
    );

    // 7. Practice Items (Speaking)
    await importCollection(
      'speaking_modules.json',
      'practiceItems',
      (data) => data.modules || [],
      { skill: 'Speaking' }
    );

    // 8. Practice Items (Writing)
    await importCollection(
      'writing_modules.json',
      'practiceItems',
      (data) => data.modules || [],
      { skill: 'Writing' }
    );

    console.log('\nImport process completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

run();
