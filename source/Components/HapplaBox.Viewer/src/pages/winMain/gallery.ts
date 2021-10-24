
import { init, HbGallery } from '@/components/gallery';
import { GalleryItem } from '@/components/gallery/types';

export const loadItems = () => {
  const items: GalleryItem[] = [];

  for (let index = 0; index < 500; index++) {
    items.push({
      name: `Pic${index + 1}`,
      src: `https://picsum.photos/seed/pic${index + 1}/300/200`,
      tooltip: `Photo ${index + 1}`,
    });
  }

  return items;
};


export class Gallery {
  public static el: HbGallery;

  public static initialize() {
    // initialize the web component
    init();
    Gallery.el = document.querySelector('hb-gallery').shadowRoot.host as unknown as HbGallery;
  }

  public static load() {
    const items = loadItems();
    Gallery.el.load({
      isHorizontal: true,
      items,
    });
  }
}
