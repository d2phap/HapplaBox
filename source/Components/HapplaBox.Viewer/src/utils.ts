
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

export default { compileTemplate };
