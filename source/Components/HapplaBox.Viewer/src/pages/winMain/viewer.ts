
import { HbBoard, init } from '@/components/board';
import { ZoomEventFunction, ZoomMode } from '@/components/board/types';
import webMessageCodes from '@/utils/webMessageCodes';
import webview2, { WebMessageModel, Webview2Event } from '@/utils/webview2';


export const onAfterZoomChanged: ZoomEventFunction = (factor: number, x: number, y: number) => {
  console.log(factor, x, y);
};

export const listenToBackendMsg = (el: HbBoard) => {
  webview2.on('message', (e: Webview2Event): void => {
    const msg = JSON.parse(e.data || '{}') as WebMessageModel;

    if (msg.code === webMessageCodes.BE_LoadFile) {
      el.loadImage(msg.data, ZoomMode.ScaleToFit);
    }
  });
};


export class Viewer {
  public static el: HbBoard;

  public static initialize() {
    // initialize the web component
    init();
    Viewer.el = document.querySelector('hb-board').shadowRoot.host as unknown as HbBoard;

    Viewer.el.initBoard({
      zoomFactor: 1,
      onAfterZoomChanged,
    });

    listenToBackendMsg(Viewer.el);

    Viewer.el.addEventListener('dragenter', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    Viewer.el.addEventListener('dragover', (e) => {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    Viewer.el.addEventListener('drop', (e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log(e.dataTransfer.files);
    });
  }
}
