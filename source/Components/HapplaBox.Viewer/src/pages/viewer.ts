
import { initVirtualList, VirtualList } from '@/components/virtual-list';
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

// initThumbnailBar();
// const thumbnailBarEl = document.querySelector('thumbnail-bar').shadowRoot.host as ThumbnailBar;
// const items = [];
// for (let index = 0; index < 1000; index++) {
//   items.push({
//     name: `Pic${index + 1}`,
//     src: `https://picsum.photos/seed/pic${index + 1}/300/200`,
//     tooltip: `Photo ${index + 1}`,
//   });
// }
// thumbnailBarEl.renderItems(items, 0);
// const myEl = thumbnailBarEl.getItem(500);
// thumbnailBarEl.selectItem(myEl);
// thumbnailBarEl.scrollToItem(myEl);


initVirtualList();
const virtualListEl = document.querySelector('virtual-list').shadowRoot.host as unknown as VirtualList;
virtualListEl.load({
  totalItems: 100_000,
  isHorizontal: true,
});

virtualListEl.scrollToIndex(50);


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

