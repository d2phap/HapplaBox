
import { HbBoard, init } from '@/components/board';
import { ZoomEventFunction, ZoomMode } from '@/components/board/types';
import webMessageCodes from '@/utils/webMessageCodes';
import webview2, { WebMessageModel, Webview2Event } from '@/utils/webview2';
import { Gallery } from './gallery';
import { Toolbar } from './toolbar';


export const onAfterZoomChanged: ZoomEventFunction = (factor: number, x: number, y: number) => {
  console.log(factor, x, y);
};

export const listenToBackendMsg = (el: HbBoard) => {
  webview2.on('message', (e: Webview2Event): void => {
    const msg = JSON.parse(e.data || '{}') as WebMessageModel;

    if (msg.code === webMessageCodes.BE_LoadFile) {
      el.loadImage(msg.data, ZoomMode.AutoZoom);
    }
  });
};


export class Viewport {
  public static el: HbBoard;

  public static initialize() {
    // initialize the web component
    init();
    Viewport.el = document.querySelector('hb-board').shadowRoot.host as unknown as HbBoard;

    Viewport.el.initBoard({
      padding: {
        top: Toolbar.el.clientHeight,
        bottom: Gallery.el.clientHeight,
      },
      zoomFactor: 1,
      onAfterZoomChanged,
      onResizing: Viewport.onResizing,
    });


    listenToBackendMsg(Viewport.el);
    // Viewport.el.loadImage('file:///E:/WALLPAPER/NEW/dark/blazing_moon_by_bisbiswas_def6rgz.jpg', ZoomMode.AutoZoom);

    Viewport.el.addEventListener('dragenter', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    Viewport.el.addEventListener('dragover', (e) => {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    Viewport.el.addEventListener('drop', (e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log(e.dataTransfer.files);
    });
  }

  public static load() {
    Viewport.el.loadImage('file:///C:/Users/d2pha/Desktop/IMG_8095.jpg', ZoomMode.AutoZoom);
  }

  private static onResizing() {
    Viewport.el.setZoomMode(ZoomMode.AutoZoom);
  }
}
