import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CloudAIGateway } from './ai/CloudAIGateway';

export const aiExecute = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in to use AI features.');
  }

  const userId = context.auth.uid;
  const { taskType, payload, aiContext } = data;

  if (!taskType || !payload) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing taskType or payload.');
  }

  // 2. Fetch User Stats and check credits
  const db = admin.firestore();
  const userStatsRef = db.collection('userStats').doc(userId);
  const userStatsSnap = await userStatsRef.get();
  
  if (!userStatsSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'User stats not found.');
  }

  const stats = userStatsSnap.data() as any;
  const remainingCredits = stats.aiRemainingCredits ?? 0;
  const overageAllowed = stats.aiOverageAllowed ?? false;
  
  // Note: For students, this will block them. Admins/teachers might bypass or have unlimited.
  if (remainingCredits <= 0 && !overageAllowed) {
    throw new functions.https.HttpsError('resource-exhausted', 'Insufficient AI credits.');
  }

  // 3. Execute via Gateway
  try {
    const gateway = CloudAIGateway.getInstance();
    const gatewayResponse = await gateway.execute(taskType, payload, aiContext);

    // 4. Record Usage and Deduct Credits
    // A more advanced implementation would calculate exact cost based on tokens/provider pricing
    const estimatedCost = gatewayResponse.estimatedTokens * 0.001; // Mock cost
    const creditsToDeduct = Math.max(1, Math.ceil(estimatedCost * 100)); // 1 credit = 1 cent approx

    await db.runTransaction(async (transaction) => {
      const currentStatsSnap = await transaction.get(userStatsRef);
      if (!currentStatsSnap.exists) return;
      
      const currentStats = currentStatsSnap.data() as any;
      const currentRemaining = currentStats.aiRemainingCredits ?? 0;
      const currentUsed = currentStats.aiUsedCredits ?? 0;

      transaction.update(userStatsRef, {
        aiRemainingCredits: Math.max(0, currentRemaining - creditsToDeduct),
        aiUsedCredits: currentUsed + creditsToDeduct
      });

      const usageRef = db.collection('ai_usage').doc();
      transaction.set(usageRef, {
        userId,
        userPlan: currentStats.plan || 'student',
        taskType,
        provider: gatewayResponse.providerUsed,
        model: 'unknown',
        inputTokens: gatewayResponse.estimatedTokens,
        outputTokens: gatewayResponse.estimatedTokens,
        estimatedCost,
        timestamp: new Date().toISOString(),
        latencyMs: gatewayResponse.latencyMs,
        success: true
      });
    });

    return {
      result: gatewayResponse.result,
      provider: gatewayResponse.providerUsed,
      creditsUsed: creditsToDeduct
    };

  } catch (error: any) {
    console.error(`AI Execution Failed for user ${userId}:`, error);
    
    // Log failed usage
    await db.collection('ai_usage').add({
      userId,
      taskType,
      provider: 'unknown',
      timestamp: new Date().toISOString(),
      success: false,
      errorMessage: error.message
    });

    throw new functions.https.HttpsError('internal', 'AI execution failed.', error.message);
  }
});
