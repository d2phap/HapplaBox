import { HbToolbar, init } from '@/components/toolbar';
import { HbToolbarClickFunc, HbToolbarItem } from '@/components/toolbar/types';
import webMessageCodes from '@/utils/webMessageCodes';
import webview2 from '@/utils/webview2';

init();
const el = document.querySelector('hb-toolbar').shadowRoot.host as unknown as HbToolbar;

// Main menu clicked
const onMenuButtonClicked: HbToolbarClickFunc = (e) => {
  webview2.post(webMessageCodes.UI_OpenMainMenu, {
    x: e.clientX,
    y: e.clientY,
  });
};


const onToolbarButtonClicked: HbToolbarClickFunc = (e, itemName) => {
  console.log(itemName, e.currentTarget);
};


const items: HbToolbarItem[] = [
  {
    type: 'button',
    name: 'btnPrevious',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/back.svg',
    label: 'Previous',
    tooltip: 'Previous (Left arrow)',
    clickFn: onToolbarButtonClicked,
  },
  {
    type: 'button',
    name: 'btnNext',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/next.svg',
    label: 'Next',
    tooltip: 'Next (Right arrow)',
    clickFn: onToolbarButtonClicked,
  },
  { type: 'divider' },
  {
    type: 'button',
    name: 'btnAutoZoom',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/autozoom.svg',
    label: 'Autozoom',
    tooltip: 'Autozoom (1)',
    clickFn: onToolbarButtonClicked,
  },
  {
    type: 'button',
    name: 'btnZoomLock',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/zoomlock.svg',
    label: 'Lock zoom ratio',
    tooltip: 'Lock zoom ratio (2)',
    clickFn: onToolbarButtonClicked,
  },
  {
    type: 'button',
    name: 'btnScaleToWidth',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletowidth.svg',
    label: 'Scale to width',
    tooltip: 'Scale to width (3)',
    clickFn: onToolbarButtonClicked,
  },
  {
    type: 'button',
    name: 'btnScaleToHeight',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletoheight.svg',
    label: 'Scale to height',
    tooltip: 'Scale to height (4)',
    clickFn: onToolbarButtonClicked,
  },
  {
    type: 'button',
    name: 'btnZoomToFit',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/zoomtofit.svg',
    label: 'Scale to fit',
    tooltip: 'Scale to fit (5)',
    clickFn: onToolbarButtonClicked,
  },
  {
    type: 'button',
    name: 'btnZoomToFill',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletofill.svg',
    label: 'Scale to fill',
    tooltip: 'Scale to fill (6)',
    clickFn: onToolbarButtonClicked,
  },
  { type: 'divider' },
  {
    type: 'button',
    name: 'btnOpenFile',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/open.svg',
    label: 'Open file',
    tooltip: 'Open file... (Ctrl+O)',
    clickFn: onToolbarButtonClicked,
  },
  {
    type: 'button',
    name: 'btnRefresh',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/refresh.svg',
    label: 'Refresh',
    tooltip: 'Refresh (R)',
    clickFn: onToolbarButtonClicked,
  },
  { type: 'divider' },
  {
    type: 'button',
    name: 'btnWindowFit',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/autosizewindow.svg',
    label: 'Window fit',
    tooltip: 'Window fit (F9)',
    clickFn: onToolbarButtonClicked,
  },
  {
    type: 'button',
    name: 'btnFullScreen',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/fullscreen.svg',
    label: 'Full screen',
    tooltip: 'Full screen (F11)',
    clickFn: onToolbarButtonClicked,
  },
  {
    type: 'button',
    name: 'btnSlideshow',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/slideshow.svg',
    label: 'Start slideshow',
    tooltip: 'Start slideshow (F12)',
    clickFn: onToolbarButtonClicked,
  },
  { type: 'divider' },
  {
    type: 'button',
    name: 'btnGallery',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/thumbnail.svg',
    label: 'Gallery',
    tooltip: 'Gallery (H)',
    clickFn: onToolbarButtonClicked,
  },
  {
    type: 'button',
    name: 'btnCheckerboard',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/checkerboard.svg',
    label: 'Checkerboard',
    tooltip: 'Checkerboard (B)',
    clickFn: onToolbarButtonClicked,
  },
  {
    type: 'button',
    name: 'btnDelete',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/delete.svg',
    label: 'Delete',
    tooltip: 'Delete (Delete)',
    clickFn: onToolbarButtonClicked,
  },
];


// load toolbar
el.load({
  items,
  position: 'top',
  onMenuButtonClicked,
});
