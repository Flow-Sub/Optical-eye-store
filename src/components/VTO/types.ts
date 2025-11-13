// TypeScript type definitions for FittingBox VTO
// Based on official FittingBox Advanced API documentation

export interface FitMixParams {
  apiKey: string;
  frame: string;
  onStopVto?: () => void;
  onIssue?: (data: any) => void;
  onOpenStream?: (result: { success: boolean }) => void;
  onLiveStatus?: (data: any) => void;
  onMode?: (mode: string) => void;
}

export interface FitMixInstance {
  startVto: (mode: 'live' | 'photo' | 'upload') => void;
  stopVto: () => void;
  setFrame: (frameCode: string) => void;
  restartVto?: () => void;
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

export interface VTOComponentProps {
  productName: string;
  eanCode?: string;
  apiKey?: string;
  onClose?: () => void;
}

export {};
