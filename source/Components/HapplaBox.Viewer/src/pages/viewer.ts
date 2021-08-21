
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
      imageUrl: 'https://image.flaticon.com/icons/png/512/149/149334.png',
      label: 'Open file',
      tooltip: 'Open file... (Ctrl+O)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'https://image.flaticon.com/icons/png/512/149/149092.png',
      label: 'Thumbnail bar',
      tooltip: 'Thumbnail bar... (H)',
      clickFn: console.table,
    } as HbToolbarButton,
    {
      type: 'button',
      imageUrl: 'https://image.flaticon.com/icons/png/512/149/149402.png',
      label: 'Checkerboard',
      tooltip: 'Checkerboard... (B)',
      clickFn: console.table,
    } as HbToolbarButton,
    { type: 'divider' },
    {
      type: 'button',
      imageUrl: 'https://image.flaticon.com/icons/png/512/149/149294.png',
      label: 'Settings',
      tooltip: 'Settings... (Ctrl+,)',
      clickFn: console.table,
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
  for (let index = 0; index < 6000; index++) {
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

