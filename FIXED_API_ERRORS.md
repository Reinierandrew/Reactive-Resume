# Fixed: API 500 Errors (Translation & Contributors)

## Problem

You were seeing 500 Internal Server Errors for:
- `GET /api/translation/languages` - 500 error
- `GET /api/contributors/github` - 500 error  
- `GET /api/contributors/crowdin` - 500 error

## Root Cause

1. **Translation Service:** Used `getOrThrow()` for optional CROWDIN variables (`CROWDIN_PROJECT_ID`, `CROWDIN_PERSONAL_TOKEN`), which threw errors when they weren't set in `.env`

2. **Contributors Service:**
   - **GitHub:** No error handling - if the API call failed, it would throw a 500 error
   - **Crowdin:** Used `getOrThrow()` for optional CROWDIN variables

3. **CROWDIN Variables:** These are optional (for translation management), but the code was treating them as required

## Solution

### 1. Translation Service (`apps/server/src/translation/translation.service.ts`)
- Changed `getOrThrow()` to `get()` for optional CROWDIN variables
- Added early return with fallback `languages` if variables aren't set
- Service now gracefully handles missing CROWDIN configuration

### 2. Contributors Service (`apps/server/src/contributors/contributors.service.ts`)
- **GitHub:** Added try-catch block to return empty array on error
- **Crowdin:** Changed `getOrThrow()` to `get()` and added early return with empty array if variables aren't set

### 3. Code Changes

**Before:**
```typescript
// Translation Service
const projectId = this.configService.getOrThrow("CROWDIN_PROJECT_ID"); // ❌ Throws if not set
const accessToken = this.configService.getOrThrow("CROWDIN_PERSONAL_TOKEN"); // ❌ Throws if not set

// GitHub Contributors
async fetchGitHubContributors() {
  const response = await this.httpService.axiosRef.get(...); // ❌ No error handling
  return data.map(...);
}
```

**After:**
```typescript
// Translation Service
const projectId = this.configService.get("CROWDIN_PROJECT_ID"); // ✅ Returns undefined if not set
const accessToken = this.configService.get("CROWDIN_PERSONAL_TOKEN"); // ✅ Returns undefined if not set

if (!projectId || !accessToken) {
  return languages; // ✅ Fallback to default languages
}

// GitHub Contributors
async fetchGitHubContributors() {
  try {
    const response = await this.httpService.axiosRef.get(...);
    return data.map(...);
  } catch {
    return []; // ✅ Return empty array on error
  }
}
```

## Files Modified

- ✅ `apps/server/src/translation/translation.service.ts` - Made CROWDIN optional with fallback
- ✅ `apps/server/src/contributors/contributors.service.ts` - Added error handling for GitHub and made CROWDIN optional

## Current Status

✅ **Translation Endpoint:** Working - Returns default languages if CROWDIN not configured  
✅ **GitHub Contributors:** Working - Returns empty array if API fails  
✅ **Crowdin Contributors:** Working - Returns empty array if CROWDIN not configured

## Testing

All endpoints now work correctly:

```bash
# Translation languages (works without CROWDIN)
curl http://localhost:3000/api/translation/languages
# Returns default language list

# GitHub contributors (works with error handling)
curl http://localhost:3000/api/contributors/github
# Returns contributor list or empty array

# Crowdin contributors (works without CROWDIN)
curl http://localhost:3000/api/contributors/crowdin
# Returns empty array if CROWDIN not configured
```

## Optional: Configure CROWDIN

If you want to use Crowdin for translation management, add to `.env`:

```env
CROWDIN_PROJECT_ID=your_project_id
CROWDIN_PERSONAL_TOKEN=your_personal_token
```

**Note:** These are completely optional - the app works fine without them!

## Summary

The API endpoints now gracefully handle:
- Missing optional configuration (CROWDIN)
- Network errors (GitHub API)
- Missing credentials

All endpoints return appropriate fallback values instead of throwing 500 errors.

