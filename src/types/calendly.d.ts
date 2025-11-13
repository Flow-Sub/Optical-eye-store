declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export interface CalendlyEventPayload {
  event: {
    uri: string;
    name: string;
    start_time: string;
    end_time: string;
    event_type: string;
  };
  invitee: {
    uri: string;
    name: string;
    email: string;
    timezone: string;
  };
}

export interface CalendlyEvent {
  event: 'calendly.event_scheduled' | 'calendly.event_type_viewed' | 'calendly.profile_page_viewed';
  payload: CalendlyEventPayload;
}

export {};