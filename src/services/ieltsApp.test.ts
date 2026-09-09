import { describe, it, expect } from 'vitest';
import { MODEL_CATALOG } from './hardwareDetector';
import { DailyTeacherService } from './dailyTeacherService';
import { IeltsTeachingRules } from './ieltsTeachingRules';

describe('AKHL IELTS Core Verification Suite', () => {
  it('verifies Dual-Tier model specs match Dr. Asif requirements', () => {
    // Model 1: Light (1.2 GB, matching Android)
    expect(MODEL_CATALOG.light.sizeLabel).toBe('1.2 GB');
    expect(MODEL_CATALOG.light.tier).toBe('light');

    // Model 2: Advanced (3.0 GB, for >= 8GB / 12GB+ RAM)
    expect(MODEL_CATALOG.advanced.sizeLabel).toBe('3.0 GB');
    expect(MODEL_CATALOG.advanced.minRamGB).toBe(8);

    // Model 3: 24/7 Oracle Cloud Fallback
    expect(MODEL_CATALOG.cloud.sizeLabel).toBe('0 MB (Zero Download)');
  });

  it('scales Daily Study Plan activities across 15m, 30m, 45m, and 60m', () => {
    const plan15 = DailyTeacherService.generatePlan('2026-09-10', 15);
    expect(plan15.activities.length).toBe(2);

    const plan30 = DailyTeacherService.generatePlan('2026-09-10', 30);
    expect(plan30.activities.length).toBe(3);

    const plan45 = DailyTeacherService.generatePlan('2026-09-10', 45);
    expect(plan45.activities.length).toBe(4);

    const plan60 = DailyTeacherService.generatePlan('2026-09-10', 60);
    expect(plan60.activities.length).toBe(4);
  });

  it('builds writing evaluation prompt enforcing Dr. Asif Zero Number Rule', () => {
    const prompt = IeltsTeachingRules.buildWritingEvaluationPrompt({
      taskType: 'Task 1',
      promptText: 'Test prompt bar chart',
      studentText: 'In 2020, 50% of people visited...',
      targetBand: 7.5,
    });

    expect(prompt).toContain('ZERO NUMBER OVERVIEW RULE');
    expect(prompt).toContain('zero_number_rule_violated');
  });

  it('builds speaking evaluation prompt enforcing 5W1H and ARE framework', () => {
    const prompt = IeltsTeachingRules.buildSpeakingEvaluationPrompt({
      partNumber: 2,
      topicQuestion: 'Describe a memorable journey',
      transcribedSpeech: 'I would like to speak about my trip to Sylhet...',
      targetBand: 7.5,
    });

    expect(prompt).toContain('five_w_one_h_coverage');
    expect(prompt).toContain('are_method_applied');
  });
});
