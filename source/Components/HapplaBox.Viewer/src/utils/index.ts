
/**
 * Compile HTML string with Js variable into plain HTML string
 * @param template HTML-Js string
 * @param obj Object variable to render
 * @returns Plain HTML string
 */
export const compileTemplate = (template: string, obj: Record<string, any>) => template.replace(/\${(.*?)}/g, (_, g) => obj[g]);

/**
 * Pause and return the given data
 * @param duration Duration in millisecond
 * @param data Data to return after resuming
 */
export const pause = <T>(duration: number, data?: T) => new Promise((resolve) => {
  setTimeout(() => resolve(data), duration);
}) as Promise<T>;


/**
 * Checks if the source code is built for production
 */
export const isProductionMode = () => process.env.NODE_ENV === 'production';


/**
 * Get CSS variable value
 * @param name CSS variable name, example: --itemSize
 * @param el Element to get variable, default is document.body
 */
export const getCssVar = (name: string, el?: HTMLElement) => {
  const rootStyle = getComputedStyle(el || document.body);

  return rootStyle.getPropertyValue(name).trim();
};
