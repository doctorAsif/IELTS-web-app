"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiExecute = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const CloudAIGateway_1 = require("./ai/CloudAIGateway");
exports.aiExecute = functions.https.onCall(async (data, context) => {
    var _a, _b;
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
    const stats = userStatsSnap.data();
    const remainingCredits = (_a = stats.aiRemainingCredits) !== null && _a !== void 0 ? _a : 0;
    const overageAllowed = (_b = stats.aiOverageAllowed) !== null && _b !== void 0 ? _b : false;
    // Note: For students, this will block them. Admins/teachers might bypass or have unlimited.
    if (remainingCredits <= 0 && !overageAllowed) {
        throw new functions.https.HttpsError('resource-exhausted', 'Insufficient AI credits.');
    }
    // 3. Execute via Gateway
    try {
        const gateway = CloudAIGateway_1.CloudAIGateway.getInstance();
        const gatewayResponse = await gateway.execute(taskType, payload, aiContext);
        // 4. Record Usage and Deduct Credits
        // A more advanced implementation would calculate exact cost based on tokens/provider pricing
        const estimatedCost = gatewayResponse.estimatedTokens * 0.001; // Mock cost
        const creditsToDeduct = Math.max(1, Math.ceil(estimatedCost * 100)); // 1 credit = 1 cent approx
        await db.runTransaction(async (transaction) => {
            var _a, _b;
            const currentStatsSnap = await transaction.get(userStatsRef);
            if (!currentStatsSnap.exists)
                return;
            const currentStats = currentStatsSnap.data();
            const currentRemaining = (_a = currentStats.aiRemainingCredits) !== null && _a !== void 0 ? _a : 0;
            const currentUsed = (_b = currentStats.aiUsedCredits) !== null && _b !== void 0 ? _b : 0;
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
    }
    catch (error) {
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
//# sourceMappingURL=aiExecute.js.map