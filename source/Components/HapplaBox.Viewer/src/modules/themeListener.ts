import webMessageCodes from '@/utils/webMessageCodes';
import webview2 from '@/utils/webview2';

// on system theme changed
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  const newColorScheme = e.matches ? 'dark' : 'light';

  webview2.post(webMessageCodes.UI_SystemThemeChanged, newColorScheme);
});
