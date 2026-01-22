# Fixed: sanitize-html Import Error

## Problem

You were seeing:
```
Uncaught SyntaxError: The requested module '/@fs/.../sanitize-html/index.js' 
does not provide an export named 'default'
```

## Root Cause

The `sanitize-html` package is a **CommonJS module**, but it was being imported as an ES module with a default import:
```typescript
import sanitizeHtml from "sanitize-html";  // ❌ Doesn't work
```

CommonJS modules don't have a default export in the same way ES modules do.

## Solution

Changed the import to use **namespace import** and handle both CommonJS and ES module formats:

```typescript
// Before (ES module import - doesn't work with CommonJS)
import sanitizeHtml from "sanitize-html";

// After (Namespace import - works with CommonJS)
import * as sanitizeHtml from "sanitize-html";
```

Then updated the usage to handle both formats:
```typescript
// Handle both namespace and default import
const sanitizeFn = (sanitizeHtml as { default?: typeof sanitizeHtml }).default ?? sanitizeHtml;
return sanitizeFn(html, { ... });
```

## Files Modified

- ✅ `libs/utils/src/namespaces/string.ts` - Fixed import and usage
- ✅ `apps/client/vite.config.ts` - Added `sanitize-html` to `optimizeDeps.include`
- ✅ `apps/artboard/vite.config.ts` - Added `sanitize-html` to `optimizeDeps.include`

## Current Status

✅ **Import:** Fixed to use namespace import  
✅ **Usage:** Handles both CommonJS and ES module formats  
✅ **Vite Config:** Optimized for CommonJS handling

## Testing

1. **Open the app:** http://localhost:5173
2. **Check browser console:** The import error should be gone
3. **Test resume creation:** HTML sanitization should work

## If Errors Persist

1. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   ```

2. **Restart the dev server:**
   ```bash
   pkill -f "pnpm dev"
   pnpm dev
   ```

3. **Hard refresh browser:**
   - Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)

## Summary

The `sanitize-html` import is now fixed to work with CommonJS modules in an ES module environment. The namespace import pattern allows Vite to properly handle the CommonJS module and convert it for browser use.

