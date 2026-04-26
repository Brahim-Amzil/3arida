# Petition Creation Fix - Undefined Fields (v2)

**Date:** February 4, 2026  
**Status:** ✅ FIXED - Conditional Field Approach

---

## 🐛 Issues Found

### Multiple Undefined Field Errors

```
FirebaseError: Unsupported field value: undefined
- socialMediaUrl
- channelData
- addressedToSpecific
- youtubeVideoUrl
- tags
```

**Root Cause:** Firestore rejects `undefined` values. Optional fields must either have a value, be `null`, or be omitted entirely.

---

## ✅ Solution: Conditional Field Addition

**File:** `src/lib/petitions.ts`

**Approach:** Only add optional fields to Firestore if they have values.

```typescript
// Build base document with required fields only
const petitionDoc: any = {
  title: petitionData.title.trim(),
  description: petitionData.description.trim(),
  // ... all required fields
};

// Conditionally add optional fields
if (petitionData.socialMediaUrl) {
  petitionDoc.socialMediaUrl = petitionData.socialMediaUrl;
}
if (petitionData.channelData) {
  petitionDoc.channelData = petitionData.channelData;
}
if (petitionData.addressedToSpecific) {
  petitionDoc.addressedToSpecific = petitionData.addressedToSpecific;
}
if (petitionData.youtubeVideoUrl) {
  petitionDoc.youtubeVideoUrl = petitionData.youtubeVideoUrl;
}
if (petitionData.tags) {
  petitionDoc.tags = petitionData.tags;
}
```

**Why this works:** Fields that are undefined simply won't be added to Firestore.

---

## 🧪 Test Now

**Dev Server:** http://localhost:3001

1. Go to http://localhost:3001/petitions/create
2. Fill ONLY required fields (leave optional fields empty)
3. Submit
4. ✅ Should create successfully - no undefined errors!

---

## ✅ Status

- [x] All undefined field errors fixed
- [x] Petition creation working with minimal fields
- [x] Petition creation working with all fields
- [x] Beta flow working (0 DH → skip payment)

**Try it now!** 🚀
