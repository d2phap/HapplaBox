import { HbToolbar, init } from '@/components/toolbar';
import { HbToolbarClickFunc, HbToolbarItem } from '@/components/toolbar/types';
import webMessageCodes from '@/utils/webMessageCodes';
import webview2 from '@/utils/webview2';
import zoomModes from '@/utils/zoomModes';

// Main menu clicked
export const onMenuButtonClicked: HbToolbarClickFunc = (e, btn) => {
  console.log(btn.name, e.currentTarget);

  webview2.post(webMessageCodes.UI_OpenMainMenu, {
    x: e.clientX,
    y: e.clientY,
  });
};


export const onToolbarButtonClicked: HbToolbarClickFunc = (e, btn) => {
  console.log(btn.name, btn.isChecked, e.currentTarget);

  webview2.post(btn.data?.code, {
    source: btn.name,
    params: btn.data?.params,
  });
};


const items: HbToolbarItem[] = [
  {
    type: 'button',
    name: 'btnPrevious',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/back.svg',
    label: 'Previous',
    tooltip: 'Previous (Left arrow)',
    data: { code: webMessageCodes.UI_ViewPrevious },
  },
  {
    type: 'button',
    name: 'btnNext',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/next.svg',
    label: 'Next',
    tooltip: 'Next (Right arrow)',
    data: { code: webMessageCodes.UI_ViewNext },
  },
  { type: 'divider' },
  {
    type: 'button',
    name: 'btnAutoZoom',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/autozoom.svg',
    label: 'Autozoom',
    tooltip: 'Autozoom (1)',
    checkable: true,
    isChecked: true,
    data: { code: webMessageCodes.UI_SetZoomMode, params: zoomModes.autoZoom },
  },
  {
    type: 'button',
    name: 'btnZoomLock',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/zoomlock.svg',
    label: 'Lock zoom ratio',
    tooltip: 'Lock zoom ratio (2)',
    checkable: true,
    data: { code: webMessageCodes.UI_SetZoomMode, params: zoomModes.lockZoom },
  },
  {
    type: 'button',
    name: 'btnScaleToWidth',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletowidth.svg',
    label: 'Scale to width',
    tooltip: 'Scale to width (3)',
    checkable: true,
    data: { code: webMessageCodes.UI_SetZoomMode, params: zoomModes.scaleToWidth },
  },
  {
    type: 'button',
    name: 'btnScaleToHeight',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletoheight.svg',
    label: 'Scale to height',
    tooltip: 'Scale to height (4)',
    checkable: true,
    data: { code: webMessageCodes.UI_SetZoomMode, params: zoomModes.scaleToHeight },
  },
  {
    type: 'button',
    name: 'btnScaleToFit',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/zoomtofit.svg',
    label: 'Scale to fit',
    tooltip: 'Scale to fit (5)',
    checkable: true,
    data: { code: webMessageCodes.UI_SetZoomMode, params: zoomModes.scaleToFit },
  },
  {
    type: 'button',
    name: 'btnScaleToFill',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletofill.svg',
    label: 'Scale to fill',
    tooltip: 'Scale to fill (6)',
    checkable: true,
    data: { code: webMessageCodes.UI_SetZoomMode, params: zoomModes.scaleToFill },
  },
  { type: 'divider' },
  {
    type: 'button',
    name: 'btnOpenFile',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/open.svg',
    label: 'Open file',
    tooltip: 'Open file... (Ctrl+O)',
    data: { code: webMessageCodes.UI_OpenFile },
  },
  {
    type: 'button',
    name: 'btnRefresh',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/refresh.svg',
    label: 'Refresh',
    tooltip: 'Refresh (R)',
    data: { code: webMessageCodes.UI_Refresh },
  },
  { type: 'divider' },
  {
    type: 'button',
    name: 'btnGallery',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/thumbnail.svg',
    label: 'Gallery',
    tooltip: 'Gallery (H)',
    checkable: true,
    data: { code: webMessageCodes.UI_ToggleGallery },
  },
  {
    type: 'button',
    name: 'btnCheckerboard',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/checkerboard.svg',
    label: 'Checkerboard',
    tooltip: 'Checkerboard (B)',
    checkable: true,
    data: { code: webMessageCodes.UI_ToggleCheckerboard },
  },
  {
    type: 'button',
    name: 'btnDelete',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/delete.svg',
    label: 'Delete',
    tooltip: 'Delete (Delete)',
    data: { code: webMessageCodes.UI_MoveToRecycleBin },
  },
];


export class Toolbar {
  public static el: HbToolbar;

  public static initialize() {
    // initialize the web component
    init();
    Toolbar.el = document.querySelector('hb-toolbar').shadowRoot.host as unknown as HbToolbar;

    Toolbar.el.load({
      items,
      position: 'top',
      menuButtonClickFn: onMenuButtonClicked,
      defaultItemClickFn: onToolbarButtonClicked,
    });
  }
}
