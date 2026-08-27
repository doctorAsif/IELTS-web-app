import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Helper to verify admin
const verifyAdmin = (context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }
  const role = context.auth.token.role;
  if (role !== 'admin' && role !== 'superadmin') {
    throw new functions.https.HttpsError('permission-denied', 'Must be an admin');
  }
  return { uid: context.auth.uid, role };
};

const auditLog = async (
  actorId: string,
  actorRole: string,
  action: string,
  entityType: string,
  entityId: string,
  result: string
) => {
  await admin.firestore().collection('audit_logs').add({
    actorId,
    actorRole,
    action,
    entityType,
    entityId,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    result
  });
};

export const approvePractice = functions.https.onCall(async (data, context) => {
  const { uid, role } = verifyAdmin(context);
  const { practiceId } = data;

  if (!practiceId) {
    throw new functions.https.HttpsError('invalid-argument', 'practiceId is required');
  }

  const practiceRef = admin.firestore().collection('practice').doc(practiceId);
  const doc = await practiceRef.get();

  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'Practice item not found');
  }

  await practiceRef.update({
    status: 'approved',
    approvedBy: uid,
    approvedAt: new Date().toISOString(),
    updatedBy: uid,
    updatedAt: new Date().toISOString()
  });

  await auditLog(uid, role, 'practice_approved', 'practice', practiceId, 'Success');

  return { success: true };
});

export const publishPractice = functions.https.onCall(async (data, context) => {
  const { uid, role } = verifyAdmin(context);
  const { practiceId } = data;

  if (!practiceId) {
    throw new functions.https.HttpsError('invalid-argument', 'practiceId is required');
  }

  const practiceRef = admin.firestore().collection('practice').doc(practiceId);
  const doc = await practiceRef.get();

  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'Practice item not found');
  }

  const practiceData = doc.data();

  // Basic validation before publishing
  if (!practiceData?.title || !practiceData?.questions || practiceData.questions.length === 0) {
    throw new functions.https.HttpsError('failed-precondition', 'Cannot publish practice item without title and questions');
  }

  if (practiceData.skill === 'listening' && !practiceData.audioPath) {
    throw new functions.https.HttpsError('failed-precondition', 'Cannot publish listening practice without audioPath');
  }

  const currentVersion = practiceData.version || 1;

  await practiceRef.update({
    status: 'published',
    publishedBy: uid,
    publishedAt: new Date().toISOString(),
    version: currentVersion,
    updatedBy: uid,
    updatedAt: new Date().toISOString()
  });

  await auditLog(uid, role, 'practice_published', 'practice', practiceId, `Success - v${currentVersion}`);

  return { success: true };
});

export const retirePractice = functions.https.onCall(async (data, context) => {
  const { uid, role } = verifyAdmin(context);
  const { practiceId } = data;

  if (!practiceId) {
    throw new functions.https.HttpsError('invalid-argument', 'practiceId is required');
  }

  const practiceRef = admin.firestore().collection('practice').doc(practiceId);
  const doc = await practiceRef.get();

  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'Practice item not found');
  }

  await practiceRef.update({
    status: 'retired',
    updatedBy: uid,
    updatedAt: new Date().toISOString()
  });

  await auditLog(uid, role, 'practice_retired', 'practice', practiceId, 'Success');

  return { success: true };
});
