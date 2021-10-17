
import '@/modules/themeListener';
import '@/pages/viewer/toolbar';

import { pause } from '@/utils';
import webMessageCodes from '@/utils/webMessageCodes';
import webview2, { WebMessageModel, Webview2Event } from '@/utils/webview2';
import { PanEventFunction, ZoomEventFunction } from '@/components/board/types';


import { init as initHbGallery, HbGallery } from '@/components/gallery';
import { init as initHbLoader } from '@/components/loader';
import { HbBoard, init as initHbBoard } from '@/components/board';


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


webview2.on('message', (e: Webview2Event) => {
  console.log(e.data);

  const msg = JSON.parse(e.data || '{}') as WebMessageModel;

  if (msg.code === webMessageCodes.BE_LoadFile) {
    boardEl.loadImage(msg.data);
  }
});

pause(0).then(loadThumbnails);
