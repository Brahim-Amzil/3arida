# Report Download Button Translation Fix

## Issue
The report download button was showing translation keys (`report.downloadButton`) instead of the actual Arabic text.

## Root Cause
The `messages/ar.json` file was corrupted:
- Missing opening brace `{`
- Missing `common` section
- Started with a comma `,`
- This caused the entire translation system to fail

## Solution

### 1. Fixed Translation File
Restored `messages/ar.json` from git backup and added the complete `report` section with all necessary translations.

### 2. Updated Component
Modified `src/components/petitions/ReportDownloadButton.tsx` to use translation keys for all progress messages instead of hardcoded Arabic text.

## Translation Keys Added

### Button Text
- `report.downloadButton`: "تحميل التقرير"
- `report.generating`: "جاري إنشاء التقرير..."

### Progress Messages
- `report.progress.generating`: "جاري إنشاء التقرير..."
- `report.progress.downloading`: "جاري تحميل التقرير..."
- `report.progress.saving`: "جاري حفظ الملف..."

### Success Messages
- `report.success.downloaded`: "تم تحميل التقرير بنجاح"

## Files Modified
1. `messages/ar.json` - Fixed JSON structure and added report translations
2. `src/components/petitions/ReportDownloadButton.tsx` - Replaced hardcoded text with translation keys

## Testing
After this fix, restart your dev server and the button should display proper Arabic text instead of translation keys.
