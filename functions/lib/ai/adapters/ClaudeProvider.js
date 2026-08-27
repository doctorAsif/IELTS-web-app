"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaudeProvider = void 0;
class ClaudeProvider {
    constructor() {
        this.providerId = 'claude';
    }
    async generateTask(prompt, context) {
        return { provider: this.providerId, message: `Mock Claude Response for: ${prompt}` };
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
        return `[Claude] Answer to: ${question}`;
    }
    async executeTask(taskType, payload, context) {
        return { provider: this.providerId, taskType, status: 'success', mock: true };
    }
}
exports.ClaudeProvider = ClaudeProvider;
//# sourceMappingURL=ClaudeProvider.js.map