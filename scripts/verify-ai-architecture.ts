import { AITaskClassifier } from '../src/lib/ai/gateway/AITaskClassifier';
import { aiRouter, AIProviderRouter } from '../src/lib/ai/gateway/AIProviderRouter';
import { APPROVED_WEB_MODELS, DEFAULT_LOCAL_MODEL_ID } from '../src/lib/ai/ModelCatalog';
import { LocalRAGEngine } from '../src/lib/engines/LocalRAGEngine';
import { SpeakingEngine } from '../src/lib/engines/SpeakingEngine';
import { WritingEngine } from '../src/lib/engines/WritingEngine';
import { DailyAITeacherEngine } from '../src/lib/engines/DailyAITeacherEngine';
import { LicenseSyncEngine } from '../src/lib/license/LicenseSyncEngine';

console.log('--- RUNNING AKHL IELTS WEB ARCHITECTURE & ENGINE VERIFICATION TESTS ---');

// Test 1: Verify Model Catalog
console.log('1. Testing Model Catalog...');
const desktopModel = APPROVED_WEB_MODELS['Llama-3.2-3B-Instruct-q4f16_1-MLC'];
if (!desktopModel || desktopModel.family !== 'llama') {
  throw new Error('Test 1.1 Failed: Primary approved desktop WebLLM model (Llama 3.2 3B) is missing or invalid.');
}
const mobileModel = APPROVED_WEB_MODELS['Qwen2.5-1.5B-Instruct-q4f16_1-MLC'];
if (!mobileModel || mobileModel.family !== 'qwen') {
  throw new Error('Test 1.2 Failed: Lightweight approved WebLLM model (Qwen 2.5 1.5B) is missing or invalid.');
}
console.log('   ✓ Model catalog contains valid Llama 3.2 3B and Qwen 2.5 1.5B configurations.');

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
console.log('   ✓ LocalRAGEngine successfully retrieved and budgeted context.');

// Test 5: SpeakingEngine Metrics Verification
console.log('5. Testing SpeakingEngine Metric Extraction...');
const sampleSpeech = "Um, I think that, like, international education is important because it broadens cultural perspectives. For example, studying abroad teaches adaptability.";
const spkAnalysis = SpeakingEngine.analyzeTranscript(sampleSpeech, 30);
if (spkAnalysis.fillerCount !== 2) { // "um", "like"
  throw new Error(`Test 5.1 Failed: Expected 2 filler words, got ${spkAnalysis.fillerCount}`);
}
if (!spkAnalysis.areCompliance.hasAssertion || !spkAnalysis.areCompliance.hasReason || !spkAnalysis.areCompliance.hasExample) {
  throw new Error('Test 5.2 Failed: ARE compliance detection failed on assertion/reason/example sample.');
}
console.log(`   ✓ SpeakingEngine verified: ${spkAnalysis.wpm} WPM, ${spkAnalysis.fillerCount} fillers, ARE score: ${spkAnalysis.areCompliance.score}/100.`);

// Test 6: WritingEngine Task 1 Zero-Number Overview & Word Count Guard
console.log('6. Testing WritingEngine Zero-Number Overview & Word Count...');
const validTask1Essay = `
The provided bar chart delineates the proportion of energy generated from solar, wind, and nuclear facilities between 2000 and 2020.

Overall, it is noticeable that solar energy exhibited a remarkable upward trajectory over the period, whereas nuclear production experienced a continuous contraction.

In 2000, solar power accounted for 5% of total capacity, which subsequently surged to 35% by the end of the timeline. Furthermore, wind generation expanded steadily from 10% to 25%. In contrast, nuclear facilities diminished from 40% in the initial year to a modest 15% in 2020.
`.trim();

const task1Analysis = WritingEngine.analyzeEssay(validTask1Essay, 'Academic Task 1: Bar chart overview and details');
if (!task1Analysis.zeroNumberOverviewVerified) {
  throw new Error('Test 6.1 Failed: Valid zero-number overview was incorrectly flagged with violation.');
}

const invalidTask1Overview = `
Overall, solar energy increased from 5% to 35%, while nuclear dropped from 40% to 15%.
`.trim();
const invalidAnalysis = WritingEngine.analyzeEssay(invalidTask1Overview, 'Academic Task 1: Bar chart overview');
if (invalidAnalysis.zeroNumberOverviewVerified) {
  throw new Error('Test 6.2 Failed: Overview with numbers was not flagged by Zero-Number Overview validator.');
}
console.log('   ✓ WritingEngine verified: Zero-Number Overview validator correctly enforces Dr. Asif Kibria\'s Task 1 rule.');

// Test 7: DailyAITeacherEngine Scaling & Rolling Window
console.log('7. Testing DailyAITeacherEngine Dynamic Scaling & Rolling Accuracy...');
const plan15m = DailyAITeacherEngine.generateDailyPlan(15, 7.0);
const plan60m = DailyAITeacherEngine.generateDailyPlan(60, 7.0);
if (plan15m.length !== 2 || plan60m.length !== 5) {
  throw new Error(`Test 7.1 Failed: Expected 2 drills for 15m and 5 drills for 60m, got ${plan15m.length} and ${plan60m.length}`);
}
if (!plan15m[0].pedagogicalRationale || plan15m[0].pedagogicalRationale.includes('SYSTEM PROMPT')) {
  throw new Error('Test 7.2 Failed: Pedagogical rationale missing or leaks system prompts.');
}
console.log(`   ✓ DailyAITeacherEngine verified: Scaled 15m (${plan15m.length} drills) to 60m (${plan60m.length} drills) with explainable rationales.`);

// Test 8: LicenseSyncEngine
console.log('8. Testing LicenseSyncEngine Hardware UUID Slots & Offline Grace...');
const devId = LicenseSyncEngine.getDeviceId();
if (!devId.startsWith('DEV-')) {
  throw new Error(`Test 8.1 Failed: Invalid hardware device ID: ${devId}`);
}
const testActivation = LicenseSyncEngine.activateLicense('AKHL-9942-8812-4410');
if (!testActivation.success) {
  throw new Error(`Test 8.2 Failed: License activation failed: ${testActivation.message}`);
}
const licStatus = LicenseSyncEngine.getLocalLicenseStatus();
if (!licStatus.hasLicense || licStatus.daysRemainingInGrace < 30) {
  throw new Error('Test 8.3 Failed: Active license state or grace period calculation invalid.');
}
console.log(`   ✓ LicenseSyncEngine verified: Hardware Slot "${devId}", ${licStatus.daysRemainingInGrace} days offline grace window.`);

console.log('\n================================================================');
console.log('ALL AKHL IELTS ARCHITECTURE & ENGINE VERIFICATION TESTS PASSED! ✓');
console.log('================================================================\n');
