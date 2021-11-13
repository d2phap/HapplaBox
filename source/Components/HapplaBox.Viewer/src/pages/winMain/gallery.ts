
import { init, HbGallery } from '@/components/gallery';
import { GalleryItem, GalleryItemClickFunc, GalleryItemEventData, GalleryRequestRenderItemsFn } from '@/components/gallery/types';
import webMessageCodes from '@/utils/webMessageCodes';
import webview2, { WebMessageModel, Webview2Event } from '@/utils/webview2';
import { Viewport } from '@/pages/winMain/viewport';


export const loadItems = (arr: Record<string, any>[] = []) => {
  const items: GalleryItem[] = [];

  arr.forEach((item) => {
    items.push({
      name: item.name,
      src: item.filename,
      tooltip: item.tooltip,
      thumbnail: undefined,
    });
  });

  return items;
};


export class Gallery {
  public static el: HbGallery;
  public static items: GalleryItem[];

  public static initialize() {
    // initialize the web component
    init();
    Gallery.el = document.querySelector('hb-gallery').shadowRoot.host as unknown as HbGallery;

    Gallery.listenToBackendMsg();
  }

  public static load(items: Record<string, any>[]) {
    Gallery.items = loadItems(items);

    Gallery.el.load({
      isHorizontal: true,
      items: Gallery.items,
      clickItemFn: Gallery.clickItemFn,
      requestRenderItemsFn: Gallery.requestThumbnailsUpdateFn,
    });
  }

  public static renderItem({ index, thumbnail }: { index: number, thumbnail: string }) {
    Gallery.el.renderItem(index, thumbnail);
  }

  private static requestThumbnailsUpdateFn: GalleryRequestRenderItemsFn = (indexes: number[]) => {
    webview2.post(webMessageCodes.UI_RequestGalleryThumbnailUpdate, indexes);
  };

  private static clickItemFn: GalleryItemClickFunc = (_: PointerEvent, data: GalleryItemEventData) => {
    Gallery.el.selectItems([data.index]);
    Viewport.el.loadImage(Gallery.items[data.index].src);
  };

  private static listenToBackendMsg = () => {
    webview2.on('message', (e: Webview2Event): void => {
      const { code, data } = JSON.parse(e.data || '{}') as WebMessageModel;
  
      if (code === webMessageCodes.BE_LoadList) {
        Gallery.load(data);
      }
      else if (code === webMessageCodes.BE_UpdateGalleryItemThumbnail) {
        Gallery.renderItem(data);
      }
    });
  };
}
