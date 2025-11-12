# FittingBox Virtual Try-On (VTO) Module

A professional, scalable, and modular Virtual Try-On solution using FittingBox's FitMix API.

## 📁 Architecture

```
src/components/VTO/
├── index.ts                 # Main exports (public API)
├── FittingBoxVTO.tsx        # Main component (container)
├── VTOButton.tsx            # Button component (presentational)
├── VTOModal.tsx             # Modal component (presentational)
├── useFittingBoxVTO.ts      # Custom hook (business logic)
├── config.ts                # Configuration & constants
├── types.ts                 # TypeScript type definitions
└── README.md                # This file
```

## 🎯 Design Principles

### 1. **Separation of Concerns**
- **Business Logic** → Custom hook (`useFittingBoxVTO`)
- **Presentation** → React components (`VTOButton`, `VTOModal`)
- **Configuration** → Centralized config file
- **Types** → Separate type definitions

### 2. **Component Composition**
- Small, focused components that do one thing well
- Reusable and testable in isolation
- Clear props interfaces

### 3. **Scalability**
- Easy to add new products with VTO
- Configurable matchers for product identification
- Extensible for multiple EAN codes

### 4. **Best Practices**
- Custom hooks for complex logic
- TypeScript for type safety
- Proper cleanup and memory management
- Comprehensive error handling
- Console logging for debugging

## 🚀 Usage

### Basic Usage

```tsx
import { FittingBoxVTO } from '@/components/VTO';

function ProductPage() {
  return (
    <FittingBoxVTO 
      productName="Ray-Ban Classic"
      eanCode="8056597149013"
    />
  );
}
```

### With Product Matcher (Recommended)

```tsx
import { FittingBoxVTO, VTO_PRODUCT_MATCHER } from '@/components/VTO';

function ProductPage({ product }) {
  return (
    <>
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

### Custom API Key

```tsx
<FittingBoxVTO 
  productName="Ray-Ban Classic"
  eanCode="8056597149013"
  apiKey="your-custom-api-key"
/>
```

## 📦 Components

### FittingBoxVTO (Container)
Main component that orchestrates the VTO experience.

**Props:**
```typescript
interface VTOComponentProps {
  productName: string;       // Display name in modal
  eanCode?: string;          // Frame EAN code
  apiKey?: string;           // API key (optional)
  onClose?: () => void;      // Callback when modal closes
}
```

### VTOButton (Presentational)
Gradient button to trigger VTO modal.

**Props:**
```typescript
interface VTOButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}
```

### VTOModal (Presentational)
Modal that displays the VTO experience.

**Props:**
```typescript
interface VTOModalProps {
  isOpen: boolean;
  productName: string;
  isLoading: boolean;
  error: string | null;
  isWidgetReady: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}
```

## 🎣 Custom Hook

### useFittingBoxVTO

Manages VTO widget lifecycle including script loading, initialization, and cleanup.

**Parameters:**
```typescript
interface UseFittingBoxVTOProps {
  eanCode: string;
  apiKey: string;
  isOpen: boolean;
}
```

**Returns:**
```typescript
interface UseFittingBoxVTOReturn {
  isLoading: boolean;
  error: string | null;
  isWidgetReady: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  startVTO: () => void;
  stopVTO: () => void;
}
```

**Example:**
```tsx
const { isLoading, error, containerRef } = useFittingBoxVTO({
  eanCode: '8056597149013',
  apiKey: 'your-api-key',
  isOpen: true,
});
```

## ⚙️ Configuration

### VTO_CONFIG

Centralized configuration in `config.ts`:

```typescript
const VTO_CONFIG = {
  DEFAULT_API_KEY: 'your-key',
  DEFAULT_EAN_CODE: '8056597149013',
  SCRIPT_URL: 'https://vto-advanced-integration-api.fittingbox.com/index.js',
  MAX_RETRIES: 20,
  RETRY_DELAY: 200,
  // ... more config
}
```

### VTO_PRODUCT_MATCHER

Product matching logic:

```typescript
// Check if product should show VTO
VTO_PRODUCT_MATCHER.shouldShowVTO(productName: string): boolean

// Get EAN code for product
VTO_PRODUCT_MATCHER.getEANForProduct(productName: string): string | null
```

**Extending for Multiple Products:**

```typescript
export const VTO_PRODUCT_MATCHER = {
  getEANForProduct: (productName: string): string | null => {
    const normalized = productName.toLowerCase();
    
    // Map product names to EAN codes
    if (normalized.includes('ray-ban')) return '8056597149013';
    if (normalized.includes('oakley')) return '8053672909258';
    if (normalized.includes('test-fitting')) return '8056597149013';
    
    return null;
  },
  
  shouldShowVTO: (productName: string): boolean => {
    return VTO_PRODUCT_MATCHER.getEANForProduct(productName) !== null;
  },
};
```

## 🔧 Advanced Usage

### Using Individual Components

```tsx
import { VTOButton, VTOModal, useFittingBoxVTO } from '@/components/VTO';

function CustomVTOImplementation() {
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
        {...vto}
      />
    </>
  );
}
```

### Manual VTO Control

```tsx
const { startVTO, stopVTO } = useFittingBoxVTO({
  eanCode: '8056597149013',
  apiKey: 'your-key',
  isOpen: true,
});

// Manual controls
<button onClick={startVTO}>Start VTO</button>
<button onClick={stopVTO}>Stop VTO</button>
```

## 🐛 Debugging

The module includes comprehensive console logging:

```
[VTO] Loading script...
[VTO] Script loaded successfully
[VTO] Init attempt 1/20
[VTO] SDK detected, creating widget...
[VTO] Widget ready
[VTO] Auto-starting...
```

Enable/disable logs by searching for `console.log('[VTO]'` in the codebase.

## 🧪 Testing

Each component can be tested in isolation:

```tsx
// Test VTOButton
<VTOButton onClick={mockFn} />

// Test VTOModal
<VTOModal 
  isOpen={true}
  productName="Test Product"
  isLoading={false}
  error={null}
  isWidgetReady={true}
  containerRef={ref}
  onClose={mockFn}
/>

// Test useFittingBoxVTO hook
const { result } = renderHook(() => useFittingBoxVTO({
  eanCode: 'test',
  apiKey: 'test',
  isOpen: true,
}));
```

## 🗑️ Removal Guide

To completely remove VTO feature:

1. **Delete the VTO directory:**
   ```bash
   rm -rf src/components/VTO
   ```

2. **Remove from ProductDetailPage:**
   ```tsx
   // Delete these lines:
   import { FittingBoxVTO, VTO_PRODUCT_MATCHER } from '../components/VTO';
   
   // And:
   {VTO_PRODUCT_MATCHER.shouldShowVTO(product.name) && (
     <FittingBoxVTO ... />
   )}
   ```

That's it! No other files are affected.

## 📝 Notes

- **Script Loading:** SDK loads only when modal opens (performance optimization)
- **Auto-start:** VTO starts automatically after widget initialization
- **Cleanup:** Proper cleanup on component unmount prevents memory leaks
- **Retry Logic:** 20 retries with 200ms intervals for SDK loading
- **Type Safety:** Full TypeScript support with global type declarations

## 🤝 Contributing

When extending this module:

1. Keep components small and focused
2. Use the custom hook for business logic
3. Add new configuration to `config.ts`
4. Update types in `types.ts`
5. Export public API through `index.ts`
6. Document changes in this README

## 📚 Related Documentation

- [FittingBox API Docs](https://developers.fittingbox.com/)
- [Main VTO Guide](../../../FITTINGBOX_VTO_GUIDE.md)

## 📄 License

Part of Optical Eye Store project.

