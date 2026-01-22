# File Upload Debugging Guide

## Current Implementation

Using a **label wrapping input** pattern - this is the most reliable HTML pattern for file inputs:

```tsx
<label className="relative ...">
  {field.value ? field.value.name : t`Choose File`}
  <input
    ref={fileInputRef}
    type="file"
    accept={accept}
    onChange={...}
    style={{ position: "absolute", ...visually hidden... }}
  />
</label>
```

## Why This Should Work

1. **Native HTML behavior** - When an input is inside a label, clicking the label triggers the input
2. **No JavaScript needed** - No programmatic `click()` calls that browsers might block
3. **Accessible** - Screen readers understand this pattern
4. **Works in all browsers** - This is standard HTML

## If It Still Doesn't Work

### Check Browser Console
1. Open DevTools (F12)
2. Check for any errors
3. Check if the input element exists: `document.querySelector('input[type="file"]')`

### Check Browser Security Settings
Some browsers block file pickers if:
- The page is in an iframe
- The page has certain security headers
- Browser extensions are blocking it

### Test in Different Browsers
- Chrome
- Firefox
- Safari
- Edge

### Check if Dialog is Blocking
The file input is inside a Radix UI Dialog. Check if:
- The dialog overlay is blocking clicks
- The dialog has `pointer-events: none` somewhere
- The form is preventing default behavior

### Alternative: Use Native File Input
If nothing works, we can try making the file input visible (not hidden) and styling it to look like a button. This is less elegant but always works.

## Next Steps

1. **Test the current implementation** - Refresh and try clicking the label
2. **Check browser console** - Look for any errors or warnings
3. **Try different browser** - Rule out browser-specific issues
4. **Check if it works outside the dialog** - Test if the issue is dialog-specific

## Browser Compatibility

The label-wrapping-input pattern works in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ All modern browsers

If it doesn't work, it's likely:
- A browser security setting
- A browser extension blocking it
- A CSS issue preventing clicks
- A JavaScript error breaking the page

