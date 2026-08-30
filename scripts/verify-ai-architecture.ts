import { AITaskClassifier } from '../src/lib/ai/gateway/AITaskClassifier';
import { aiRouter, AIProviderRouter } from '../src/lib/ai/gateway/AIProviderRouter';
import { APPROVED_WEB_MODELS, DEFAULT_LOCAL_MODEL_ID } from '../src/lib/ai/ModelCatalog';
import { LocalRAGEngine } from '../src/lib/engines/LocalRAGEngine';

console.log('--- RUNNING AKHL IELTS WEB LOCAL AI ARCHITECTURE TESTS ---');

// Test 1: Verify Model Catalog
console.log('1. Testing Model Catalog...');
const model = APPROVED_WEB_MODELS[DEFAULT_LOCAL_MODEL_ID];
if (!model || model.modelId !== 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC') {
  throw new Error('Test 1 Failed: Primary approved WebLLM model is missing or invalid.');
}
console.log('   ✓ Model catalog contains valid Qwen 2.5 1.5B configuration.');

// Test 2: Verify AITaskClassifier
console.log('2. Testing AITaskClassifier...');
if (!AITaskClassifier.canRunLocally('speaking_evaluation', { transcript: 'sample' })) {
  throw new Error('Test 2.1 Failed: speaking_evaluation must be permitted to run locally.');
}
if (!AITaskClassifier.canRunLocally('writing_evaluation', { essay: 'short essay' })) {
  throw new Error('Test 2.2 Failed: writing_evaluation must be permitted to run locally.');
}
if (!AITaskClassifier.canRunLocally('reading_explanation', {})) {
  throw new Error('Test 2.3 Failed: reading_explanation must be permitted to run locally.');
}
if (AITaskClassifier.canRunLocally('admin_analysis', {})) {
  throw new Error('Test 2.4 Failed: admin_analysis must NOT run locally.');
}
console.log('   ✓ AITaskClassifier correctly routes local-capable tasks.');

// Test 3: Verify Single Authoritative Router
console.log('3. Testing Single Authoritative Router...');
if (!aiRouter || !(aiRouter instanceof AIProviderRouter)) {
  throw new Error('Test 3 Failed: aiRouter singleton must be an instance of AIProviderRouter.');
}
if (aiRouter.providerId !== 'router') {
  throw new Error('Test 3.2 Failed: Router providerId must be "router".');
}
console.log('   ✓ Single authoritative AIProviderRouter verified.');

// Test 4: Verify Local RAG Token Budgeting
console.log('4. Testing Local RAG Context Retrieval & Token Budgeting...');
const context = LocalRAGEngine.retrieveContext('How to improve coherence and cohesion in Task 2 essay?', 300);
if (!context.includes('Coherence')) {
  throw new Error('Test 4 Failed: LocalRAGEngine failed to retrieve relevant coherence criteria.');
}
console.log('   ✓ LocalRAGEngine successfully retrieved and budgeted context:', context.slice(0, 80) + '...');

console.log('\n======================================================');
console.log('ALL LOCAL AI ARCHITECTURE TESTS PASSED SUCCESSFULLY! ✓');
console.log('======================================================\n');
