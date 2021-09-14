
import { init as initHbGallery, HbGallery } from '@/components/gallery';
// import { init as initHbLoader } from '@/components/loader';
import { HbToolbar, init as initHbToolbar } from '@/components/toolbar';
import { HbToolbarButton, HbToolbarItem } from '@/components/toolbar/types';
import { pause } from '@/utils';
import {
  Board,
  InterpolationMode,
  PanEventFunction,
  ZoomEventFunction,
} from '@d2phap/happla';


const elBoard = document.getElementById('board');
const elWrapper = document.getElementById('wrapper');
const elBoardContent = document.getElementById('boardContent');

const elScaleRatio = document.getElementById('elScaleRatio');
const elZoom = document.getElementById('elZoom');
const elX = document.getElementById('elX');
const elY = document.getElementById('elY');
const elWidth = document.getElementById('elWidth');
const elHeight = document.getElementById('elHeight');

function loadToolbar() {
  initHbToolbar();

  const toolbarEl = document.querySelector('hb-toolbar').shadowRoot.host as unknown as HbToolbar;
  const items: HbToolbarItem[] = [
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/back.svg',
      label: 'Previous',
      tooltip: 'Previous (Left arrow)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/next.svg',
      label: 'Next',
      tooltip: 'Next (Right arrow)',
      clickFn: console.table,
    } as HbToolbarButton,
    { type: 'divider' },
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/leftrotate.svg',
      label: 'Rotate left',
      tooltip: 'Rotate left (Ctrl+,)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/rightrotate.svg',
      label: 'Rotate right',
      tooltip: 'Rotate right (Ctrl+.)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/fliphorz.svg',
      label: 'Flip horizontal',
      tooltip: 'Flip horizontal (Ctrl+;)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/flipvert.svg',
      label: 'Flip vertical',
      tooltip: 'Flip vertical (Ctrl+\')',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/crop.svg',
      label: 'Crop',
      tooltip: 'Crop... (C)',
      clickFn: console.table,
    } as HbToolbarButton,
    { type: 'divider' },
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/autozoom.svg',
      label: 'Autozoom',
      tooltip: 'Autozoom (1)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/zoomlock.svg',
      label: 'Lock zoom ratio',
      tooltip: 'Lock zoom ratio (2)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletowidth.svg',
      label: 'Scale to width',
      tooltip: 'Scale to width (3)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletoheight.svg',
      label: 'Scale to height',
      tooltip: 'Scale to height (4)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/zoomtofit.svg',
      label: 'Scale to fit',
      tooltip: 'Scale to fit (5)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/scaletofill.svg',
      label: 'Scale to fill',
      tooltip: 'Scale to fill (6)',
      clickFn: console.table,
    } as HbToolbarButton,
    { type: 'divider' },
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/open.svg',
      label: 'Open file',
      tooltip: 'Open file... (Ctrl+O)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/refresh.svg',
      label: 'Refresh',
      tooltip: 'Refresh (R)',
      clickFn: console.table,
    } as HbToolbarButton,
    { type: 'divider' },
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/autosizewindow.svg',
      label: 'Window fit',
      tooltip: 'Window fit (F9)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/fullscreen.svg',
      label: 'Full screen',
      tooltip: 'Full screen (F11)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/slideshow.svg',
      label: 'Start slideshow',
      tooltip: 'Start slideshow (F12)',
      clickFn: console.table,
    } as HbToolbarButton,
    { type: 'divider' },
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/thumbnail.svg',
      label: 'Thumbnail bar',
      tooltip: 'Thumbnail bar (H)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/checkerboard.svg',
      label: 'Checkerboard',
      tooltip: 'Checkerboard (B)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/delete.svg',
      label: 'Delete',
      tooltip: 'Delete (Delete)',
      clickFn: console.table,
    } as HbToolbarButton,
    { type: 'space', group: 'bottom' },
    {
      type: 'button',
      group: 'bottom',
      imageUrl: 'file:///D:/_GITHUB/ImageGlass/Source/ImageGlass/bin/x64/Debug/Themes/Colibre-24.Amir-H-Jahangard/menu.svg',
      label: 'Settings',
      tooltip: 'Settings... (Ctrl+,)',
      clickFn: () => toolbarEl.toggleOverflowDropdown(),
    } as HbToolbarButton,
  ];

  toolbarEl.load({
    items,
    position: 'top',
    rightClickFn: console.log,
  });
}


function loadThumbnails() {
  initHbGallery();

  const galleryEl = document.querySelector('hb-gallery').shadowRoot.host as unknown as HbGallery;
  const items = [];
  for (let index = 0; index < 600; index++) {
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

  galleryEl.scrollToIndex(3_0);
  galleryEl.selectItems([30]);
}


const onAfterZoomChanged: ZoomEventFunction = (factor: number, x: number, y: number) => {
  elZoom.innerText = factor.toString();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  elScaleRatio.innerText = board.scaleRatio.toFixed(2);
  elX.innerText = x.toFixed(2);
  elY.innerText = y.toFixed(2);

  const w = (elBoardContent.clientWidth * factor).toFixed(2);
  const h = (elBoardContent.clientHeight * factor).toFixed(2);

  elWidth.innerText = `${w}px (${elBoardContent.clientWidth}px)`;
  elHeight.innerText = `${h}px (${elBoardContent.clientHeight}px)`;
};

const onPanning: PanEventFunction = (x: number, y: number) => {
  elX.innerText = x.toString();
  elY.innerText = y.toString();
};

const onBeforeContentReady = () => {
  elWrapper.style.opacity = '0';
  elWrapper.style.transition = 'opacity ease 300ms';
};

const onContentReady = () => {
  // elBoardContent.style.opacity = 1;
  // elBoardContent.style.transition = '';
};


const board = new Board(elBoard, elBoardContent, {
  onAfterZoomChanged,
  onPanning,
  onBeforeContentReady,
  onContentReady,
});

pause(500).then(() => {
  loadToolbar();
  loadThumbnails();
});


board.imageRendering = InterpolationMode.Auto;
board.waitForContentReady()
  .then(async () => {
    board.enable();

    const w = elBoardContent.scrollWidth / board.scaleRatio;
    const h = elBoardContent.scrollHeight / board.scaleRatio;

    const widthScale = elBoard.clientWidth / w;
    const heightScale = elBoard.clientHeight / h;
    const scale = Math.min(widthScale, heightScale);

    const x = (elBoard.offsetWidth - (w * scale)) / 2;
    const y = (elBoard.offsetHeight - (h * scale)) / 2;

    await board.panTo(-w / 2, -h / 2);
    board.zoomTo(scale, x, y);

    elWrapper.style.opacity = '1';
  });

// const img = document.getElementById('img');

// var poll = new Promise((resolve) => {
//   setInterval(function () {
//     if (img.naturalWidth) {
//       clearInterval(poll);

//       resolve({
//         width: img.naturalWidth,
//         height: img.naturalHeight,
//       });
//     }
//   }, 5);
// });

// poll.then(async ({ width, height }) => {
//   board.imageRendering = InterpolationMode.Pixelated;
//   console.log(board.imageRendering);

//   board.enable();

//   const w = elBoardContent.scrollWidth;
//   const h = elBoardContent.scrollHeight;

//   const widthScale = elBoard.clientWidth / w;
//   const heightScale = elBoard.clientHeight / h;
//   const scale = Math.min(widthScale, heightScale);

//   const x = (elBoard.offsetWidth - (w * scale)) / 2;
//   const y = (elBoard.offsetHeight - (h * scale)) / 2;

//   console.log(`${x}, ${y}`);
//   await board.zoomTo(scale, x, y);

//   // board.panTo(0, 0);
// });

