import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Define costs according to policy
const COSTS: Record<string, number> = {
  speaking: 20,
  writing: 20,
  reading: 20,
  listening: 20,
  mock_exam: 5,
  daily_teacher: 5,
};

export const debitTrialCredit = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be logged in to consume trial credits.'
    );
  }

  const { activityType } = data;
  if (!activityType || typeof activityType !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a valid activityType.'
    );
  }

  const cost = COSTS[activityType];
  if (cost === undefined) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `Invalid activityType: ${activityType}`
    );
  }

  const uid = context.auth.uid;
  const userRef = admin.firestore().collection('users').doc(uid);

  try {
    const result = await admin.firestore().runTransaction(async (t) => {
      const doc = await t.get(userRef);
      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'User document not found.');
      }

      const userData = doc.data();
      const stats = userData?.stats || {};
      
      // Default initial states if missing (handles migration implicitly)
      const trialCreditsTotal = stats.trialCreditsTotal ?? 20;
      const trialCreditsUsed = stats.trialCreditsUsed ?? 0;
      const trialCreditsRemaining = stats.trialCreditsRemaining ?? 20;

      if (trialCreditsRemaining < cost) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Insufficient trial credits.'
        );
      }

      const newRemaining = trialCreditsRemaining - cost;
      const newUsed = trialCreditsUsed + cost;

      t.set(userRef, {
        stats: {
          ...stats,
          trialCreditsTotal,
          trialCreditsRemaining: newRemaining,
          trialCreditsUsed: newUsed,
        }
      }, { merge: true });

      return {
        success: true,
        trialCreditsRemaining: newRemaining,
        trialCreditsUsed: newUsed,
      };
    });

    return result;
  } catch (error) {
    console.error(`Error debiting credits for ${uid}:`, error);
    throw new functions.https.HttpsError('internal', 'Transaction failed.', error);
  }
});
