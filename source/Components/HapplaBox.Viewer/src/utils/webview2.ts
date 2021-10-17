
export interface WebMessageModel {
  code: string;
  data: any;
}

export interface Webview2Event extends Event {
  data: string;
}


/**
 * Send a event to backend
 * @param code Event code
 * @param data Data to send to backend
 */
export const post = (code: string, data?: any) => {
  const payload: WebMessageModel = { code, data };

  // @ts-ignore
  window.chrome.webview?.postMessage(payload);
};


/**
 * Add event listerner from backend
 * @param code Event code
 * @param handler Function to handle the event
 */
export const on = (code: string, handler: (e: Webview2Event) => void) => {
  // @ts-ignore
  window.chrome.webview?.addEventListener(code, handler);
};


export default {
  on,
  post,
};
