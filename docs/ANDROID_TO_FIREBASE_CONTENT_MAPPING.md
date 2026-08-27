# Android to Firebase Content Mapping

This document describes how the Android `assets/database` JSON files map to the authoritative Firebase Firestore database for the Web application.

## 1. Mapped Collections

| Android JSON File | Target Firestore Collection | Notes |
| --- | --- | --- |
| `curriculum_master.json` | `curriculum` | Maps directly to the `curriculum` collection. |
| `grammar_modules.json` | `grammar` | Maps directly to the `grammar` collection. |
| `listening_modules.json` | `practiceItems` | Tagged with `skill: "Listening"` and `status: "draft"`. |
| `practice_sessions.json` | `mockExams` | Maps to the `mockExams` collection (as multi-part sessions). |
| `reading_modules.json` | `practiceItems` | Tagged with `skill: "Reading"` and `status: "draft"`. |
| `speaking_modules.json` | `practiceItems` | Tagged with `skill: "Speaking"` and `status: "draft"`. |
| `vocabulary_modules.json` | `vocabulary` | Maps directly to the `vocabulary` collection. |
| `writing_modules.json` | `practiceItems` | Tagged with `skill: "Writing"` and `status: "draft"`. |

## 2. Versioning Strategy
Every document imported into Firestore will be wrapped or augmented with the following versioning and provenance fields:

```typescript
{
  ...originalData,
  schemaVersion: "1.0",
  contentVersion: 1,
  source: "akhl_android_assets",
  importedAt: new Date().toISOString(),
  originalFile: "filename.json",
  status: "draft" // Ensures content requires manual review before publishing
}
```

## 3. Preservation of IDs and Duplicates
- The original IDs (`practiceId` or equivalent) from the Android JSON files will be preserved.
- The import pipeline will run a query against Firestore prior to insertion to check if a document with that ID already exists.
- If a document exists, the import script will **skip** it to prevent overwriting or duplicating records.

## 4. Media Dependencies
**Status: No media dependencies found.**
An exhaustive scan of all Android JSON files revealed no keys matching `audioPath`, `videoPath`, `imagePath`, or `documentPath`. Therefore, there are no immediate files that need migrating to Firebase Storage. If any are added to the source files later, the import script will need a secondary media-upload phase.

## 5. Schema Problems or Anomalies
- The files have slight variations in their root structure. Most have a `modules` array at the root, while `practice_sessions.json` is a root array, and `curriculum_master.json` has `akhl_ielts_master_curriculum` at the root. The import script normalizes these access patterns.
- No files were deemed `UNKNOWN_REVIEW_REQUIRED` as all cleanly mapped to existing or planned Firebase collections.
