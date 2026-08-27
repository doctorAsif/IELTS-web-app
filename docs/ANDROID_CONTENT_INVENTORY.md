# Android Content Inventory

This document provides an inventory of the JSON content files found in the Android project repository at `<ANDROID_PROJECT>/assets/database/`.

## Inventory Summary

Total JSON files found: **8**
Files with media references: **0**

All 8 files have been classified as `SHARED_CONTENT`. None of the files appear to be `ANDROID_SPECIFIC`, `DUPLICATE`, or `OBSOLETE`.

### 1. curriculum_master.json
- **Classification:** `SHARED_CONTENT`
- **Schema Shape:** Object containing a master array (`akhl_ielts_master_curriculum`)
- **Record Count:** 18 items
- **Content Type:** Curriculum stage definitions and expected mastery.
- **Reusable for Web:** Yes
- **Dependencies:** None

### 2. grammar_modules.json
- **Classification:** `SHARED_CONTENT`
- **Schema Shape:** Object with a `modules` array.
- **Record Count:** 31 items
- **Content Type:** Grammar practice items and concepts.
- **Reusable for Web:** Yes
- **Dependencies:** None

### 3. listening_modules.json
- **Classification:** `SHARED_CONTENT`
- **Schema Shape:** Object with a `modules` array.
- **Record Count:** 25 items
- **Content Type:** Listening scripts, parts, questions, and answer keys.
- **Reusable for Web:** Yes
- **Dependencies:** None

### 4. practice_sessions.json
- **Classification:** `SHARED_CONTENT`
- **Schema Shape:** Array of objects.
- **Record Count:** 12 items
- **Content Type:** Multi-part practice sessions with AI rubrics and questions.
- **Reusable for Web:** Yes
- **Dependencies:** None

### 5. reading_modules.json
- **Classification:** `SHARED_CONTENT`
- **Schema Shape:** Object with a `modules` array.
- **Record Count:** 25 items
- **Content Type:** Reading passages, questions, and strategies.
- **Reusable for Web:** Yes
- **Dependencies:** None

### 6. speaking_modules.json
- **Classification:** `SHARED_CONTENT`
- **Schema Shape:** Object with a `modules` array.
- **Record Count:** 110 items
- **Content Type:** Speaking prompts, models, and scoring criteria.
- **Reusable for Web:** Yes
- **Dependencies:** None

### 7. vocabulary_modules.json
- **Classification:** `SHARED_CONTENT`
- **Schema Shape:** Object with a `modules` array.
- **Record Count:** 105 items
- **Content Type:** Vocabulary sets and usage examples.
- **Reusable for Web:** Yes
- **Dependencies:** None

### 8. writing_modules.json
- **Classification:** `SHARED_CONTENT`
- **Schema Shape:** Object with a `modules` array.
- **Record Count:** 48 items
- **Content Type:** Writing Task 1/2 prompts, models, and strategies.
- **Reusable for Web:** Yes
- **Dependencies:** None
