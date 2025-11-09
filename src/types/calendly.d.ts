declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: {
        url: string;
        prefill?: {
          name?: string;
          email?: string;
          firstName?: string;
          lastName?: string;
          customAnswers?: {
            a1?: string;
            a2?: string;
            a3?: string;
            a4?: string;
            a5?: string;
            a6?: string;
            a7?: string;
            a8?: string;
            a9?: string;
            a10?: string;
          };
        };
        utm?: {
          utmCampaign?: string;
          utmSource?: string;
          utmMedium?: string;
          utmContent?: string;
          utmTerm?: string;
        };
      }) => void;
      closePopupWidget?: () => void;
      showPopupWidget?: (url: string) => void;
    };
  }
}

export {};