import * as admin from 'firebase-admin';

// Initialize Firebase Admin only once
if (!admin.apps.length) {
    admin.initializeApp();
}

// Re-export specific domains
export * from './roles';
export * from './content';
export * from './aiExecute';
export * from './TrialCreditPolicy';
// More functions can be exported here as they are added (e.g. licenses, analytics)
