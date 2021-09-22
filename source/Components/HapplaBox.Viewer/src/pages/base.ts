
console.log('base');

// on system theme changed
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  const newColorScheme = e.matches ? 'dark' : 'light';

  console.log(newColorScheme);

  // @ts-ignore
  window.chrome.webview.postMessage(newColorScheme);
});

