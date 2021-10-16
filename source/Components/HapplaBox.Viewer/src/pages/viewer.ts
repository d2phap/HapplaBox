
import { pause } from '@/utils';
import webMessageCodes from '@/modules/webMessageCodes';
import webview2, { WebMessageModel, Webview2Event } from '@/modules/webview2';
import { PanEventFunction, ZoomEventFunction } from '@/components/board/types';
import { HbToolbarItem } from '../components/toolbar/types';


import { init as initHbGallery, HbGallery } from '../components/gallery';
import { init as initHbLoader } from '../components/loader';
import { HbToolbar, init as initHbToolbar } from '../components/toolbar';
import { HbBoard, init as initHbBoard } from '../components/board';


// const elScaleRatio = document.getElementById('elScaleRatio');
// const elZoom = document.getElementById('elZoom');
// const elX = document.getElementById('elX');
// const elY = document.getElementById('elY');
// const elWidth = document.getElementById('elWidth');
// const elHeight = document.getElementById('elHeight');

initHbBoard();
initHbLoader();
const boardEl = document.querySelector('hb-board').shadowRoot.host as unknown as HbBoard;

function loadBoard() {
  const onAfterZoomChanged: ZoomEventFunction = (factor: number, x: number, y: number) => {
    console.log(factor);
  };

  const onPanning: PanEventFunction = (x: number, y: number) => {
    //
  };

  const onBeforeContentReady = () => {
    // elWrapper.style.opacity = '0';
    // elWrapper.style.transition = 'opacity ease 300ms';
  };

  const onContentReady = () => {
    // elBoardContent.style.opacity = 1;
    // elBoardContent.style.transition = '';
  };

  boardEl.initBoard({
    zoomFactor: 1,
    onAfterZoomChanged,
    onPanning,
    onBeforeContentReady,
    onContentReady,
  });
}

function loadToolbar() {
  initHbToolbar();

  const toolbarEl = document.querySelector('hb-toolbar').shadowRoot.host as unknown as HbToolbar;
  const items: HbToolbarItem[] = [
    {
      type: 'button',
      name: 'btnPrevious',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/back.svg',
      label: 'Previous',
      tooltip: 'Previous (Left arrow)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    {
      type: 'button',
      name: 'btnNext',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/next.svg',
      label: 'Next',
      tooltip: 'Next (Right arrow)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    { type: 'divider' },
    {
      type: 'button',
      name: 'btnAutoZoom',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/autozoom.svg',
      label: 'Autozoom',
      tooltip: 'Autozoom (1)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    {
      type: 'button',
      name: 'btnZoomLock',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/zoomlock.svg',
      label: 'Lock zoom ratio',
      tooltip: 'Lock zoom ratio (2)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    {
      type: 'button',
      name: 'btnScaleToWidth',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletowidth.svg',
      label: 'Scale to width',
      tooltip: 'Scale to width (3)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    {
      type: 'button',
      name: 'btnScaleToHeight',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletoheight.svg',
      label: 'Scale to height',
      tooltip: 'Scale to height (4)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    {
      type: 'button',
      name: 'btnZoomToFit',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/zoomtofit.svg',
      label: 'Scale to fit',
      tooltip: 'Scale to fit (5)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    {
      type: 'button',
      name: 'btnZoomToFill',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletofill.svg',
      label: 'Scale to fill',
      tooltip: 'Scale to fill (6)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    { type: 'divider' },
    {
      type: 'button',
      name: 'btnOpenFile',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/open.svg',
      label: 'Open file',
      tooltip: 'Open file... (Ctrl+O)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    {
      type: 'button',
      name: 'btnRefresh',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/refresh.svg',
      label: 'Refresh',
      tooltip: 'Refresh (R)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    { type: 'divider' },
    {
      type: 'button',
      name: 'btnWindowFit',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/autosizewindow.svg',
      label: 'Window fit',
      tooltip: 'Window fit (F9)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    {
      type: 'button',
      name: 'btnFullScreen',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/fullscreen.svg',
      label: 'Full screen',
      tooltip: 'Full screen (F11)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    {
      type: 'button',
      name: 'btnSlideshow',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/slideshow.svg',
      label: 'Start slideshow',
      tooltip: 'Start slideshow (F12)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    { type: 'divider' },
    {
      type: 'button',
      name: 'btnGallery',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/thumbnail.svg',
      label: 'Gallery',
      tooltip: 'Gallery (H)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    {
      type: 'button',
      name: 'btnCheckerboard',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/checkerboard.svg',
      label: 'Checkerboard',
      tooltip: 'Checkerboard (B)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
    {
      type: 'button',
      name: 'btnDelete',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/delete.svg',
      label: 'Delete',
      tooltip: 'Delete (Delete)',
      clickFn: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
    },
  ];

  toolbarEl.load({
    items,
    position: 'top',
    rightClickFn: console.log,
    onMenuButtonClicked: (e: PointerEvent, itemName) => console.log(itemName, e.currentTarget),
  });
}


function loadThumbnails() {
  initHbGallery();

  const galleryEl = document.querySelector('hb-gallery').shadowRoot.host as unknown as HbGallery;
  const items = [];
  for (let index = 0; index < 50; index++) {
    items.push({
      name: `Pic${index + 1}`,
      src: `https://picsum.photos/seed/pic${index + 1}/300/200`,
      tooltip: `Photo ${index + 1}`,
    });
  }

  galleryEl.load({
    isHorizontal: true,
    items,
  });

  galleryEl.scrollToIndex(30);
  galleryEl.selectItems([5, 30]);
}

loadBoard();
// boardEl.loadImage('file:///E:/WALLPAPER/NEW/dark/surroundings_by_bisbiswas_dbs1qwp.jpg');


webview2.on('message', (e: Webview2Event) => {
  console.log(e.data);

  const msg = JSON.parse(e.data || '{}') as WebMessageModel;

  if (msg.code === webMessageCodes.BE_LoadFile) {
    boardEl.loadImage(msg.data);
  }
});

pause(0).then(loadToolbar);
pause(0).then(loadThumbnails);
