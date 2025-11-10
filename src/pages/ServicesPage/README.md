# ServicesPage - Architecture Documentation

## Overview

The ServicesPage has been refactored following industry best practices for maintainability and scalability. The component is now modular, type-safe, and follows a clean separation of concerns.

## Directory Structure

```
ServicesPage/
├── README.md                           # This file
├── index.ts                            # Public exports
├── ServicesPage.tsx                    # Main page component
├── constants.ts                        # Constants and configuration
├── types.ts                            # TypeScript interfaces
├── utils.ts                            # Utility functions
├── useBookingFlow.ts                   # Custom hook for booking logic
└── components/                         # UI components
    ├── index.ts                        # Component exports
    ├── BookingModal/                   # Booking modal components
    │   ├── index.ts
    │   ├── BookingModal.tsx            # Main modal container
    │   ├── ProgressSteps.tsx           # Progress indicator
    │   ├── LocationStep.tsx            # Location selection
    │   ├── ServiceStep.tsx             # Service selection
    │   └── CalendlyStep.tsx            # Contact info form
    ├── HeroSection.tsx                 # Hero banner
    ├── LocationsSection.tsx            # Locations grid section
    ├── ServicesSection.tsx             # Services grid section
    ├── WhyChooseUsSection.tsx          # Benefits section
    ├── FAQSection.tsx                  # FAQ section
    ├── ServiceCard.tsx                 # Individual service card
    ├── LocationCard.tsx                # Individual location card
    ├── FAQItem.tsx                     # Individual FAQ item
    ├── WhyChooseUsItem.tsx            # Individual benefit item
    ├── LoadingSpinner.tsx              # Loading state
    └── ErrorMessage.tsx                # Error state
```

## Key Features

### 1. **Modular Architecture**
- Each component has a single responsibility
- Easy to test, maintain, and extend
- Components can be reused across the application

### 2. **Type Safety**
- Comprehensive TypeScript interfaces in `types.ts`
- Strong typing throughout the codebase
- Prevents runtime errors and improves developer experience

### 3. **Custom Hooks**
- `useBookingFlow`: Manages all booking-related state and logic
- Separates business logic from UI components
- Reusable and testable

### 4. **Separation of Concerns**
- **Components**: Pure UI rendering
- **Hooks**: Business logic and state management
- **Utils**: Reusable utility functions
- **Constants**: Configuration and static data
- **Types**: Type definitions

### 5. **Error Handling**
- Dedicated error states for API failures
- User-friendly error messages
- Retry functionality where appropriate

### 6. **Accessibility (a11y)**
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Semantic HTML

### 7. **Performance Optimizations**
- Lazy loading of Calendly scripts
- Memoized callbacks in hooks
- Efficient re-render management

## Usage

### Importing the Page

```typescript
import { ServicesPage } from './pages/ServicesPage';
```

### Using Individual Components

```typescript
import { ServiceCard, LocationCard } from './pages/ServicesPage/components';

function MyComponent() {
  return (
    <ServiceCard service={serviceData} />
  );
}
```

### Using the Booking Hook

```typescript
import { useBookingFlow } from './pages/ServicesPage/useBookingFlow';

function MyBookingComponent() {
  const {
    openBookingFlow,
    closeBookingFlow,
    selectedLocation,
    handleLocationSelect,
    // ... other methods and state
  } = useBookingFlow();
  
  // Use the booking logic
}
```

## Data Flow

1. **Data Fetching**: ServicesPage fetches data using custom hooks
   - `useStoreLocations()` - Fetches store locations
   - `useServices(true)` - Fetches active services

2. **Data Formatting**: Raw API data is formatted for UI
   - `formatServicesForUI()` transforms service data

3. **State Management**: `useBookingFlow` hook manages booking state
   - Location selection
   - Service selection
   - Form data
   - Submission logic

4. **UI Rendering**: Components receive formatted data as props
   - Pure components with no side effects
   - Easy to test and preview

## Best Practices Implemented

### 1. **DRY (Don't Repeat Yourself)**
- Reusable components and utilities
- Shared constants and types
- Custom hooks for common logic

### 2. **Single Responsibility Principle**
- Each component does one thing well
- Hooks handle specific concerns
- Utils are focused and atomic

### 3. **Open/Closed Principle**
- Easy to extend without modifying existing code
- New services/locations can be added via API
- New sections can be added as new components

### 4. **Dependency Inversion**
- Components depend on abstractions (props/interfaces)
- Not tightly coupled to implementations
- Easy to mock for testing

### 5. **Composition Over Inheritance**
- Small, composable components
- Build complex UIs from simple pieces
- Flexible and maintainable

## Testing Strategy

### Unit Tests
```typescript
// Test individual components
describe('ServiceCard', () => {
  it('renders service information correctly', () => {
    // Test implementation
  });
});

// Test hooks
describe('useBookingFlow', () => {
  it('manages booking state correctly', () => {
    // Test implementation
  });
});

// Test utilities
describe('formatServicesForUI', () => {
  it('formats service data correctly', () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
// Test component interactions
describe('ServicesPage', () => {
  it('completes booking flow successfully', () => {
    // Test implementation
  });
});
```

## Extending the Page

### Adding a New Section

1. Create a new section component:
```typescript
// components/NewSection.tsx
export const NewSection: React.FC<NewSectionProps> = ({ data }) => {
  return (
    <section className="py-24 bg-white">
      {/* Section content */}
    </section>
  );
};
```

2. Export from components/index.ts:
```typescript
export { NewSection } from './NewSection';
```

3. Add to ServicesPage.tsx:
```typescript
import { NewSection } from './components';

// In JSX:
<NewSection data={data} />
```

### Adding a New Booking Step

1. Create the step component in `components/BookingModal/`:
```typescript
// NewStep.tsx
export const NewStep: React.FC<NewStepProps> = ({ ... }) => {
  return <div>New step content</div>;
};
```

2. Update `types.ts` to include the new step
3. Update `useBookingFlow.ts` to handle the new step logic
4. Add the step to `BookingModal.tsx`

## Performance Considerations

- Components are kept small for faster rendering
- Callbacks are memoized to prevent unnecessary re-renders
- Images use lazy loading
- External scripts are loaded asynchronously
- API calls are optimized with proper loading states

## Maintenance Guide

### When to Update

- **constants.ts**: Update FAQ, benefits, or configuration
- **types.ts**: Add new interfaces when data structure changes
- **utils.ts**: Add new utility functions here
- **components/**: Modify UI appearance and behavior
- **useBookingFlow.ts**: Update booking logic and state management

### Code Style

- Use functional components with hooks
- Prefer composition over complexity
- Keep components under 200 lines
- Extract repeated logic into hooks or utils
- Add TypeScript types for all props and state
- Use descriptive variable and function names
- Add JSDoc comments for complex functions

## Environment Variables

Required environment variables:

```env
VITE_API_BASE_URL=http://134.209.6.174:3000/api
```

## Dependencies

- React 18+
- TypeScript 4.9+
- Lucide React (icons)
- Tailwind CSS (styling)
- Calendly (scheduling)

## Migration Notes

The old monolithic `ServicesPage.tsx` (770+ lines) has been split into:
- 1 main component (130 lines)
- 14 smaller components (avg 50 lines each)
- 1 custom hook (140 lines)
- Utilities, types, and constants files

This improves:
- Code readability
- Maintainability
- Testability
- Collaboration (less merge conflicts)
- Performance (tree-shaking, code splitting)

## Future Improvements

Potential enhancements:
- Add unit tests for all components
- Implement E2E tests with Playwright/Cypress
- Add Storybook for component documentation
- Implement analytics tracking
- Add client-side form validation
- Optimize images with next-gen formats
- Add skeleton loaders for better UX
- Implement progressive web app features

