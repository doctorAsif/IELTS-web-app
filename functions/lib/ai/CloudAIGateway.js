"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudAIGateway = void 0;
const GeminiProvider_1 = require("./adapters/GeminiProvider");
const OpenAIProvider_1 = require("./adapters/OpenAIProvider");
const ClaudeProvider_1 = require("./adapters/ClaudeProvider");
const admin = require("firebase-admin");
class CloudAIGateway {
    constructor() {
        this.adapters = new Map();
        this.adapters.set('gemini', new GeminiProvider_1.GeminiProvider());
        this.adapters.set('openai', new OpenAIProvider_1.OpenAIProvider());
        this.adapters.set('claude', new ClaudeProvider_1.ClaudeProvider());
    }
    static getInstance() {
        if (!CloudAIGateway.instance) {
            CloudAIGateway.instance = new CloudAIGateway();
        }
        return CloudAIGateway.instance;
    }
    async execute(taskType, payload, context) {
        // 1. Fetch Routing Policy from Firestore
        const settingsDoc = await admin.firestore().collection('ai_settings').doc('routing').get();
        const settings = settingsDoc.data() || { defaultProvider: 'gemini', enabledProviders: ['gemini', 'openai', 'claude'] };
        let providerId = settings.defaultProvider;
        // Optional: override provider if specific context asks for it, and it's enabled
        if ((context === null || context === void 0 ? void 0 : context.preferredProvider) && settings.enabledProviders.includes(context.preferredProvider)) {
            providerId = context.preferredProvider;
        }
        const adapter = this.adapters.get(providerId) || this.adapters.get('gemini');
        if (!adapter) {
            throw new Error(`No suitable AI adapter found for provider: ${providerId}`);
        }
        console.log(`[CloudAIGateway] Executing ${taskType} via ${adapter.providerId}`);
        // 2. Execute Task
        let result;
        switch (taskType) {
            case 'student_question':
                result = await adapter.generalQuestion(payload.question, context);
                break;
            case 'speaking_evaluation':
                result = await adapter.evaluateSpeaking(payload.audioTranscript, payload.targetCriteria, context);
                break;
            case 'writing_evaluation':
                result = await adapter.evaluateWriting(payload.essay, payload.taskType, context);
                break;
            case 'task_generation':
                result = await adapter.generateTask(payload.prompt, context);
                break;
            default:
                result = await adapter.executeTask(taskType, payload, context);
                break;
        }
        return {
            result,
            providerUsed: adapter.providerId,
            estimatedTokens: 150,
            latencyMs: 1200 // Mock latency
        };
    }
}
exports.CloudAIGateway = CloudAIGateway;
//# sourceMappingURL=CloudAIGateway.js.map