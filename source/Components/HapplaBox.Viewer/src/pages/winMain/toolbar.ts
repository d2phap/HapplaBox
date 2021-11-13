import { HbToolbar, init } from '@/components/toolbar';
import { HbToolbarClickFunc, HbToolbarItem } from '@/components/toolbar/types';
import webMessageCodes from '@/utils/webMessageCodes';
import webview2 from '@/utils/webview2';
import zoomModes from '@/utils/zoomModes';
import { Gallery } from '@/pages/winMain/gallery';
import { Viewport } from '@/pages/winMain/viewport';


export const onToolbarButtonClicked: HbToolbarClickFunc = (e, btn) => {
  const { code, params } = btn.data || {};
  console.log(btn.name, btn.data, btn.isChecked, e.currentTarget);

  webview2.post(code, {
    params,
    source: btn.name,
  });

  if (code === webMessageCodes.UI_ToggleCheckerboard) {
    Viewport.el.setAttribute('checkerboard', (!!btn.isChecked).toString());
  }
  else if (code === webMessageCodes.UI_ToggleGallery) {
    Gallery.el.setAttribute('visible', (!!btn.isChecked).toString());
  }
  else if (code === webMessageCodes.UI_SetZoomMode) {
    Viewport.zoomMode = params;
    Viewport.refresh();
  }
  else if (code === webMessageCodes.UI_Refresh) {
    Viewport.refresh();
  }
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
    checkableGroup: '_zoom_mode_',
    data: { code: webMessageCodes.UI_SetZoomMode, params: zoomModes.autoZoom },
  },
  {
    type: 'button',
    name: 'btnZoomLock',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/zoomlock.svg',
    label: 'Lock zoom ratio',
    tooltip: 'Lock zoom ratio (2)',
    checkable: true,
    checkableGroup: '_zoom_mode_',
    data: { code: webMessageCodes.UI_SetZoomMode, params: zoomModes.lockZoom },
  },
  {
    type: 'button',
    name: 'btnScaleToWidth',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletowidth.svg',
    label: 'Scale to width',
    tooltip: 'Scale to width (3)',
    checkable: true,
    checkableGroup: '_zoom_mode_',
    data: { code: webMessageCodes.UI_SetZoomMode, params: zoomModes.scaleToWidth },
  },
  {
    type: 'button',
    name: 'btnScaleToHeight',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletoheight.svg',
    label: 'Scale to height',
    tooltip: 'Scale to height (4)',
    checkable: true,
    checkableGroup: '_zoom_mode_',
    data: { code: webMessageCodes.UI_SetZoomMode, params: zoomModes.scaleToHeight },
  },
  {
    type: 'button',
    name: 'btnScaleToFit',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/zoomtofit.svg',
    label: 'Scale to fit',
    tooltip: 'Scale to fit (5)',
    checkable: true,
    checkableGroup: '_zoom_mode_',
    data: { code: webMessageCodes.UI_SetZoomMode, params: zoomModes.scaleToFit },
  },
  {
    type: 'button',
    name: 'btnScaleToFill',
    imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletofill.svg',
    label: 'Scale to fill',
    tooltip: 'Scale to fill (6)',
    checkable: true,
    checkableGroup: '_zoom_mode_',
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
    isChecked: true,
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
  }

  public static load() {
    Toolbar.el.load({
      items,
      position: 'top',
      menuButtonClickFn: Toolbar.onMenuButtonClicked,
      defaultItemClickFn: onToolbarButtonClicked,
    });
  }

  // Main menu clicked
  private static onMenuButtonClicked(e: PointerEvent, btn: HbToolbarItem) {
    const x = Math.trunc(Toolbar.el.clientWidth * devicePixelRatio);
    const y = Math.trunc(Toolbar.el.clientHeight * devicePixelRatio);

    webview2.post(webMessageCodes.UI_OpenMainMenu, { x, y });
  }
}
