type DL = Record<string, unknown>;
declare global {
  interface Window {
    dataLayer?: DL[];
  }
}

export type TrackEvent =
  | 'generate_lead'
  | 'begin_booking'
  | 'booking_step'
  | 'purchase'
  | 'add_to_cart'
  | 'begin_checkout'
  | 'click_to_call'
  | 'chat_started'
  | 'quote_form_error';
export function track(event: TrackEvent, data: DL = {}) {
  (window.dataLayer ??= []).push({ event, ...data });
}
