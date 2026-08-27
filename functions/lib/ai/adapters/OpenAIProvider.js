"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
class OpenAIProvider {
    constructor() {
        this.providerId = 'openai';
    }
    async generateTask(prompt, context) {
        return { provider: this.providerId, message: `Mock OpenAI Response for: ${prompt}` };
    }
    async evaluateSpeaking(audioTranscript, targetCriteria, context) {
        return {
            provider: this.providerId,
            overallBand: 7.0,
            feedback: 'Good fluency, mock evaluation.'
        };
    }
    async evaluateWriting(essay, taskType, context) {
        return {
            provider: this.providerId,
            overallBand: 6.5,
            feedback: 'Clear structure, mock evaluation.'
        };
    }
    async generalQuestion(question, context) {
        return `[OpenAI] Answer to: ${question}`;
    }
    async executeTask(taskType, payload, context) {
        return { provider: this.providerId, taskType, status: 'success', mock: true };
    }
}
exports.OpenAIProvider = OpenAIProvider;
//# sourceMappingURL=OpenAIProvider.js.map