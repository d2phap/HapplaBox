import webview2, { Webview2Event } from '@/modules/webview2';
import { isProductionMode } from '@/utils';

console.log('base', isProductionMode());

// on system theme changed
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  const newColorScheme = e.matches ? 'dark' : 'light';

  console.log(newColorScheme);

  webview2.post('UI_SystemThemeChanged', newColorScheme);
});


webview2.on('message', (e: Webview2Event) => {
  console.log(e.data);
});
