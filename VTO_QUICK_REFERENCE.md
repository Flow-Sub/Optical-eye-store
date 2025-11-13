# VTO Quick Reference Card

## 📁 File Structure (New Modular Architecture)

```
src/components/VTO/
├── index.ts                 ✅ Main exports
├── FittingBoxVTO.tsx        ✅ Container component
├── VTOButton.tsx            ✅ Button UI
├── VTOModal.tsx             ✅ Modal UI
├── useFittingBoxVTO.ts      ✅ Custom hook (logic)
├── config.ts                ✅ Configuration
├── types.ts                 ✅ TypeScript types
└── README.md                ✅ Module docs
```

## 🎯 Quick Usage

### In ProductDetailPage (Already Integrated)

```tsx
import { FittingBoxVTO, VTO_PRODUCT_MATCHER } from '../components/VTO';

{VTO_PRODUCT_MATCHER.shouldShowVTO(product.name) && (
  <FittingBoxVTO 
    productName={product.name}
    eanCode={VTO_PRODUCT_MATCHER.getEANForProduct(product.name) || undefined}
  />
)}
```

## ⚙️ Add New Products

Edit `src/components/VTO/config.ts`:

```typescript
getEANForProduct: (productName: string): string | null => {
  const normalized = productName.toLowerCase();
  
  if (normalized.includes('test-fitting')) return '8056597149013';
  if (normalized.includes('ray-ban')) return '8056597149013';
  // Add your product here:
  if (normalized.includes('oakley')) return '8053672909258';
  
  return null;
},
```

## 🎨 Component Breakdown

| Component | Purpose | Can Reuse? |
|-----------|---------|------------|
| `FittingBoxVTO` | Main container | ✅ Use anywhere |
| `VTOButton` | Try On button | ✅ Use standalone |
| `VTOModal` | Modal window | ✅ Use standalone |
| `useFittingBoxVTO` | Business logic | ✅ Use in custom components |

## 🔧 Configuration Options

```typescript
// src/components/VTO/config.ts

VTO_CONFIG = {
  DEFAULT_API_KEY: 'xoKdlHt2xTHGRt4zfeo3tGTpmJrlEKM4dv9lu1lR',
  DEFAULT_EAN_CODE: '8056597149013',
  MAX_RETRIES: 20,
  RETRY_DELAY: 200,
  // Change these as needed
}
```

## 🐛 Debug Checklist

1. **Open browser console** (F12)
2. **Look for logs:** `[VTO] ...`
3. **Check script load:** Should see "Script loaded successfully"
4. **Check SDK:** Should see "SDK detected"
5. **Check widget:** Should see "Widget ready"

## 🗑️ Quick Removal

```bash
# 1. Delete module
rm -rf src/components/VTO

# 2. Remove from ProductDetailPage.tsx
# - Delete import on line 12
# - Delete usage on lines 272-277
```

## 📊 Benefits of New Architecture

| Before | After |
|--------|-------|
| ❌ Single 284-line file | ✅ 7 focused files |
| ❌ Mixed concerns | ✅ Separated concerns |
| ❌ Hard to test | ✅ Easy to unit test |
| ❌ Hard to extend | ✅ Easy to add products |
| ❌ No types | ✅ Full TypeScript |
| ❌ Basic docs | ✅ Comprehensive docs |

## 🚀 Next Steps

1. ✅ Test with "test-fitting-box" product
2. ✅ Add more products in config.ts
3. ✅ Customize button/modal styling if needed
4. ✅ Monitor console logs for issues
5. ✅ Test on mobile devices

## 📚 Documentation

- **This Card:** Quick reference (you are here)
- **Module README:** `src/components/VTO/README.md` (detailed)
- **Main Guide:** `FITTINGBOX_VTO_GUIDE.md` (complete guide)

---

**Current Status:** ✅ Production Ready
**Architecture:** v2.0 Modular
**Last Updated:** 2024


