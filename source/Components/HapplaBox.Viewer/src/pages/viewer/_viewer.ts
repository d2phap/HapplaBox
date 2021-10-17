
import '@/modules/themeListener';
import { Toolbar } from '@/pages/viewer/toolbar';
import { Gallery } from '@/pages/viewer/gallery';

import webMessageCodes from '@/utils/webMessageCodes';
import webview2, { WebMessageModel, Webview2Event } from '@/utils/webview2';
import { PanEventFunction, ZoomEventFunction } from '@/components/board/types';


import { HbBoard, init as initHbBoard } from '@/components/board';

initHbBoard();
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


loadBoard();


Toolbar.initialize();

Gallery.initialize();
Gallery.el.scrollToIndex(30);
Gallery.el.selectItems([5, 30]);


webview2.on('message', (e: Webview2Event) => {
  console.log(e.data);

  const msg = JSON.parse(e.data || '{}') as WebMessageModel;

  if (msg.code === webMessageCodes.BE_LoadFile) {
    boardEl.loadImage(msg.data);
  }
});
