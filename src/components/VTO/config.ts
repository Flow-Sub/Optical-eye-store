// FittingBox VTO Configuration

export const VTO_CONFIG = {
  // API Configuration
  DEFAULT_API_KEY: 'xoKdlHt2xTHGRt4zfeo3tGTpmJrlEKM4dv9lu1lR',
  DEFAULT_EAN_CODE: '8056597149013',
  
  // Script Configuration
  SCRIPT_URL: 'https://vto-advanced-integration-api.fittingbox.com/index.js',
  SCRIPT_ID: 'fitmix-vto-script',
  CONTAINER_ID: 'fitmix-vto-container',
  
  // Retry Configuration
  MAX_RETRIES: 20,
  RETRY_DELAY: 200, // ms
  INIT_DELAY: 200, // ms
  AUTO_START_DELAY: 500, // ms
  
  // VTO Mode
  DEFAULT_MODE: 'live' as const,
  
  // Error Messages
  ERRORS: {
    SCRIPT_LOAD_FAILED: 'Failed to load Virtual Try-On. Please check your internet connection.',
    SDK_NOT_LOADED: 'FitMix SDK not loaded. Please refresh and try again.',
    FRAME_NOT_FOUND: 'This frame is not available for VTO yet.',
    INIT_FAILED: 'Failed to initialize Virtual Try-On',
    GENERIC: 'Unable to load Virtual Try-On. Please try again.',
  },
} as const;

// Product matching configuration
export const VTO_PRODUCT_MATCHER = {
  // Check if product should have VTO enabled
  shouldShowVTO: (productName: string): boolean => {
    const normalized = productName.toLowerCase();
    return normalized.includes('test-fitting') && normalized.includes('box');
  },
  
  // You can extend this to support multiple products with their EAN codes
  getEANForProduct: (productName: string): string | null => {
    const normalized = productName.toLowerCase();
    if (normalized.includes('test-fitting') && normalized.includes('box')) {
      return VTO_CONFIG.DEFAULT_EAN_CODE;
    }
    return null;
  },
};

