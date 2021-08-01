
/**
 * Compile HTML string with Js variable into plain HTML string
 * @param template HTML-Js string
 * @param o Object variable to render
 * @returns Plain HTML string
 */
export const compileTemplate = (template: string, o: any): string => {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, prefer-template
  const handler = new Function('o', 'const tagged = (o) => `' + template + '`; return tagged(o)');

  return handler(o);
};


/**
 * Pause and return the given data
 * @param duration Duration in millisecond
 * @param data Data to return after resuming
 */
export const pause = <T>(duration: number, data?: T) => new Promise((resolve) => {
  setTimeout(() => resolve(data), duration);
}) as Promise<T>;
