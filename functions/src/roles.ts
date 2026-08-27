import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

export const setRole = onCall(async (request) => {
  // Check if the requester is authenticated
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  // Only superadmins or admins can set roles.
  // We can enforce that only superadmins can create admins.
  const callerRole = request.auth.token.role;
  const targetUid = request.data.uid;
  const targetRole = request.data.role;

  if (callerRole !== 'superadmin' && callerRole !== 'admin') {
    throw new HttpsError('permission-denied', 'You do not have permission to assign roles.');
  }

  // Admins cannot assign superadmin role
  if (targetRole === 'superadmin' && callerRole !== 'superadmin') {
    throw new HttpsError('permission-denied', 'Only superadmins can create other superadmins.');
  }

  try {
    // Set custom user claims
    await admin.auth().setCustomUserClaims(targetUid, { role: targetRole });

    // Also update the user record in Firestore for easier querying
    await admin.firestore().collection('staff').doc(targetUid).set({
      role: targetRole,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: request.auth.uid,
    }, { merge: true });

    // Audit log
    await admin.firestore().collection('audit_logs').add({
      action: 'SET_ROLE',
      targetUid: targetUid,
      targetRole: targetRole,
      actorUid: request.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { message: `Successfully assigned role ${targetRole} to user ${targetUid}` };
  } catch (error) {
    console.error('Error setting role:', error);
    throw new HttpsError('internal', 'Error setting role.');
  }
});

// A temporary function to bootstrap the very first superadmin
// In production, this should be deleted or protected by a strong secret.
export const bootstrapSuperAdmin = onCall(async (request) => {
  // Requires a secret to prevent anyone from calling it
  const secret = request.data.secret;
  const expectedSecret = process.env.BOOTSTRAP_SECRET || 'changeme_to_secure_secret_in_prod';
  
  if (secret !== expectedSecret) {
    throw new HttpsError('permission-denied', 'Invalid bootstrap secret.');
  }

  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be authenticated to bootstrap yourself.');
  }

  const uid = request.auth.uid;
  
  try {
    await admin.auth().setCustomUserClaims(uid, { role: 'superadmin' });
    return { message: 'You are now a superadmin. Please refresh your token.' };
  } catch (error) {
    throw new HttpsError('internal', 'Error bootstrapping superadmin.');
  }
});
