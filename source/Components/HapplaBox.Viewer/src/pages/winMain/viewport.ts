
import { HbBoard, init } from '@/components/board';
import { ZoomMode } from '@/components/board/types';
import webMessageCodes from '@/utils/webMessageCodes';
import webview2, { WebMessageModel, Webview2Event } from '@/utils/webview2';
import { Gallery } from './gallery';
import { Toolbar } from './toolbar';


export class Viewport {
  public static el: HbBoard;
  public static zoomMode: ZoomMode = ZoomMode.AutoZoom;

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
      onAfterZoomChanged: Viewport.onAfterZoomChanged,
      onResizing: Viewport.onResizing,
    });

    Viewport.listenToBackendMsg();

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
    Viewport.el.loadImage('file:///C:/Users/d2pha/Desktop/IMG_8095.jpg', Viewport.zoomMode);
  }

  public static refresh(duration: number = 400) {
    Viewport.el.setZoomMode(Viewport.zoomMode, duration);
  }

  private static onResizing() {
    Viewport.refresh(0);
  }

  private static onAfterZoomChanged(factor: number) {
    console.log(factor);
  }

  private static listenToBackendMsg() {
    webview2.on('message', (e: Webview2Event): void => {
      const msg = JSON.parse(e.data || '{}') as WebMessageModel;
  
      if (msg.code === webMessageCodes.BE_LoadFile) {
        Viewport.el.loadImage(msg.data, ZoomMode.AutoZoom);
      }
    });
  }
}
