
export interface WebMessageModel {
  name: string;
  data: any;
}

export interface Webview2Event extends Event {
  data: string;
}


/**
 * Send a event to backend
 * @param name Event name
 * @param data Data to send to backend
 */
export const post = (name: string, data: any) => {
  const payload: WebMessageModel = { name, data };

  // @ts-ignore
  window.chrome.webview.postMessage(payload);
};


/**
 * Add event listerner from backend
 * @param name Event name
 * @param handler Function to handle the event
 */
export const on = (name: string, handler: (e: Webview2Event) => void) => {
  // @ts-ignore
  window.chrome.webview.addEventListener(name, handler);
};


export default {
  on,
  post,
};
