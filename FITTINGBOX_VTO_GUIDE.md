# FittingBox Virtual Try-On Integration Guide

## Overview
This project features a **professional, scalable Virtual Try-On (VTO) system** using FittingBox's FitMix Advanced API. The implementation follows industry best practices with modular architecture, separation of concerns, and TypeScript type safety.

## 🏗️ Architecture

### Modular Structure
```
src/components/VTO/
├── index.ts                 # Public API exports
├── FittingBoxVTO.tsx        # Main container component
├── VTOButton.tsx            # Button UI component
├── VTOModal.tsx             # Modal UI component
├── useFittingBoxVTO.ts      # Custom hook with business logic
├── config.ts                # Configuration & constants
├── types.ts                 # TypeScript definitions
└── README.md                # Detailed module documentation
```

### Key Design Principles

✅ **Separation of Concerns**
- Business logic isolated in custom hook
- Presentational components for UI
- Configuration centralized
- Types properly defined

✅ **Scalability**
- Easy to add new products
- Configurable product matchers
- Extensible for multiple EAN codes

✅ **Maintainability**
- Small, focused components
- Clear interfaces
- Comprehensive error handling
- Detailed logging for debugging

## 🚀 Quick Start

### Basic Implementation

In any product page:

```tsx
import { FittingBoxVTO, VTO_PRODUCT_MATCHER } from '@/components/VTO';

function ProductPage({ product }) {
  return (
    <>
      {/* VTO Button appears only for enabled products */}
      {VTO_PRODUCT_MATCHER.shouldShowVTO(product.name) && (
        <FittingBoxVTO 
          productName={product.name}
          eanCode={VTO_PRODUCT_MATCHER.getEANForProduct(product.name) || undefined}
        />
      )}
    </>
  );
}
```

### Current Integration

**File:** `src/pages/ProductDetailPage.tsx`

```tsx
// Line 12: Import
import { FittingBoxVTO, VTO_PRODUCT_MATCHER } from '../components/VTO';

// Line 272-277: Usage
{VTO_PRODUCT_MATCHER.shouldShowVTO(product.name) && (
  <FittingBoxVTO 
    productName={product.name}
    eanCode={VTO_PRODUCT_MATCHER.getEANForProduct(product.name) || undefined}
  />
)}
```

## ⚙️ Configuration

### Current Settings

**File:** `src/components/VTO/config.ts`

```typescript
export const VTO_CONFIG = {
  DEFAULT_API_KEY: 'xoKdlHt2xTHGRt4zfeo3tGTpmJrlEKM4dv9lu1lR',
  DEFAULT_EAN_CODE: '8056597149013',
  SCRIPT_URL: 'https://vto-advanced-integration-api.fittingbox.com/index.js',
  // ... more config
}
```

### Adding New Products

Edit `config.ts` to enable VTO for more products:

```typescript
export const VTO_PRODUCT_MATCHER = {
  getEANForProduct: (productName: string): string | null => {
    const normalized = productName.toLowerCase();
    
    // Add your products here
    if (normalized.includes('test-fitting')) return '8056597149013';
    if (normalized.includes('ray-ban')) return '8056597149013';
    if (normalized.includes('oakley')) return '8053672909258';
    // Add more products...
    
    return null;
  },
  
  shouldShowVTO: (productName: string): boolean => {
    return VTO_PRODUCT_MATCHER.getEANForProduct(productName) !== null;
  },
};
```

## 📦 Component API

### FittingBoxVTO Component

**Props:**
```typescript
interface VTOComponentProps {
  productName: string;       // Display name in modal
  eanCode?: string;          // Frame EAN code (default: '8056597149013')
  apiKey?: string;           // API key (optional, has default)
  onClose?: () => void;      // Callback when modal closes
}
```

**Example:**
```tsx
<FittingBoxVTO 
  productName="Ray-Ban Classic"
  eanCode="8056597149013"
  apiKey="custom-key"
  onClose={() => console.log('VTO closed')}
/>
```

## 🔄 How It Works

1. **User clicks "Try On Now"** → Opens modal with gradient button
2. **Script loads** → FitMix SDK loads from CDN (only when needed)
3. **Widget initializes** → `FitMix.createWidget()` with EAN and API key
4. **Retry logic** → Up to 20 retries if SDK not ready
5. **Camera requested** → Browser asks for webcam permission
6. **VTO starts** → Auto-starts in live camera mode
7. **User tries on** → Real-time virtual try-on experience
8. **Cleanup** → Proper cleanup on modal close

## 🎨 Styling

The VTO module uses TailwindCSS with modern design:

- **Button:** Gradient blue-purple with shadow
- **Modal:** Rounded corners, backdrop blur, smooth animations
- **Loading:** Animated spinner with helpful text
- **Error:** Clear error messages with retry option
- **Responsive:** Works on mobile and desktop

## 🐛 Debugging

### Console Logging

The module includes detailed logging:

```
[VTO] Loading script...
[VTO] Script loaded successfully
[VTO] Init attempt 1/20
[VTO] SDK detected, creating widget...
[VTO] Widget ready
[VTO] Auto-starting...
```

### Common Issues

#### "FitMix SDK not loaded"
- Check network connection
- Verify URL: `vto-advanced-integration-api.fittingbox.com/index.js`
- Check browser console for errors
- Retry up to 20 times automatically

#### "This frame is not available for VTO yet"
- EAN code not in FittingBox database
- Verify EAN code is correct
- Check API key has access to frame
- Contact FittingBox support

#### Camera not working
- Ensure HTTPS (required in production)
- Check browser permissions
- Try different browser
- Ensure camera not used by other app

## 🗑️ Removal Guide

### Complete Removal (2 steps)

**Step 1:** Delete the VTO module
```bash
rm -rf src/components/VTO
```

**Step 2:** Remove from ProductDetailPage
```tsx
// Delete import (line 12):
import { FittingBoxVTO, VTO_PRODUCT_MATCHER } from '../components/VTO';

// Delete usage (lines 272-277):
{VTO_PRODUCT_MATCHER.shouldShowVTO(product.name) && (
  <FittingBoxVTO ... />
)}
```

That's it! The feature is completely isolated.

### Disable Temporarily

Just comment out the usage in ProductDetailPage:

```tsx
{/* VTO temporarily disabled
{VTO_PRODUCT_MATCHER.shouldShowVTO(product.name) && (
  <FittingBoxVTO ... />
)}
*/}
```

## 🧪 Testing

### Unit Testing

Each component can be tested independently:

```tsx
import { VTOButton, VTOModal, useFittingBoxVTO } from '@/components/VTO';

// Test button
<VTOButton onClick={mockFn} />

// Test modal
<VTOModal isOpen={true} {...props} />

// Test hook
const { result } = renderHook(() => useFittingBoxVTO({
  eanCode: 'test',
  apiKey: 'test',
  isOpen: true,
}));
```

### Manual Testing

1. Navigate to test-fitting-box product
2. Click "Try On Now" button
3. Allow camera access
4. Verify VTO loads and works
5. Test on mobile device
6. Test error states (wrong EAN)

## 🚀 Advanced Usage

### Custom Implementation

Use individual components for custom UI:

```tsx
import { VTOButton, VTOModal, useFittingBoxVTO } from '@/components/VTO';

function CustomVTO() {
  const [isOpen, setIsOpen] = useState(false);
  const vto = useFittingBoxVTO({
    eanCode: '8056597149013',
    apiKey: 'your-key',
    isOpen,
  });

  return (
    <>
      <VTOButton onClick={() => setIsOpen(true)} />
      <VTOModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        productName="Custom Product"
        {...vto}
      />
    </>
  );
}
```

### Manual Controls

```tsx
const { startVTO, stopVTO } = useFittingBoxVTO({...});

<button onClick={startVTO}>Start</button>
<button onClick={stopVTO}>Stop</button>
```

## 📊 Performance

- ✅ **Lazy Loading:** SDK loads only when modal opens
- ✅ **Cleanup:** Proper cleanup prevents memory leaks
- ✅ **Retry Logic:** Handles slow networks gracefully
- ✅ **Code Splitting:** Modular structure enables tree shaking

## 🔒 Security

- API key is client-side (standard for FittingBox)
- Camera access requires user permission
- HTTPS required in production
- No sensitive data stored

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 60+     | ✅ Full support |
| Firefox | 55+     | ✅ Full support |
| Safari  | 11+     | ✅ Full support |
| Edge    | 79+     | ✅ Full support |
| Mobile Safari | iOS 11+ | ✅ Full support |
| Chrome Mobile | All | ✅ Full support |

## 📚 Documentation

- **Module README:** `src/components/VTO/README.md`
- **This Guide:** `FITTINGBOX_VTO_GUIDE.md`
- **FittingBox Docs:** [developers.fittingbox.com](https://developers.fittingbox.com/)

## 🎯 Best Practices

When working with VTO module:

1. ✅ Use `VTO_PRODUCT_MATCHER` for consistency
2. ✅ Don't modify components directly, extend through config
3. ✅ Test on multiple devices and browsers
4. ✅ Monitor console logs for issues
5. ✅ Keep EAN codes in config, not hardcoded
6. ✅ Use TypeScript types provided
7. ✅ Follow the existing patterns for new features

## 🤝 Support

For issues with:
- **Implementation:** Check this guide and module README
- **FittingBox API:** Contact FittingBox support
- **EAN codes:** Verify with frame supplier
- **Integration:** Review console logs for debugging

## 📝 Changelog

### v2.0 (Current) - Modular Architecture
- Separated concerns into multiple files
- Created custom hook for business logic
- Added product matcher configuration
- Improved TypeScript types
- Enhanced error handling
- Added comprehensive documentation

### v1.0 - Initial Implementation
- Basic monolithic component
- Hardcoded configuration
- Limited documentation

---

**Made with ❤️ for Optical Eye Store**
