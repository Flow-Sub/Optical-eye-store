// TypeScript type definitions for FittingBox VTO

export interface FitMixParams {
  apiKey: string;
  frame: string;
  onStopVto?: () => void;
  onIssue?: (data: FitMixIssue) => void;
}

export interface FitMixIssue {
  type?: string;
  message?: string;
  code?: string;
}

export interface FitMixInstance {
  startVto: (mode: 'live' | 'upload') => void;
  stopVto: () => void;
  setFrame: (frameCode: string) => void;
}

declare global {
  interface Window {
    FitMix?: {
      createWidget: (
        containerId: string,
        params: FitMixParams,
        callback: () => void
      ) => FitMixInstance;
    };
    fitmixInstance?: FitMixInstance;
  }
}

export interface VTOConfig {
  apiKey: string;
  scriptUrl: string;
  containerId: string;
  mode: 'live' | 'upload';
}

export interface VTOComponentProps {
  productName: string;
  eanCode?: string;
  apiKey?: string;
  onClose?: () => void;
}

export {};

