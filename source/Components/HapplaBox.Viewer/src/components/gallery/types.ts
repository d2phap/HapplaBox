
export interface GalleryItem {
  src: string;
  thumbnail: string;
  name?: string;
  tooltip?: string;
  isSelected?: boolean;
}

export interface GalleryItemEventData {
  index: number,
  el: HTMLElement,
}

export type GalleryItemClickFunc = (e: PointerEvent, data: GalleryItemEventData) => any;
export type GalleryItemDblClickFunc = (e: MouseEvent, data: GalleryItemEventData) => any;
export type GalleryRequestRenderItemsFn = (itemIndexes: number[]) => any;

export interface HbGalleryOptions {
  isHorizontal?: boolean;
  items: GalleryItem[];
  isSelectOnClicked?: boolean;
  clickItemFn?: GalleryItemClickFunc;
  rightClickItemFn?: GalleryItemClickFunc;
  middleClickItemFn?: GalleryItemClickFunc;
  doubleClickItemFn?: GalleryItemDblClickFunc;
  requestRenderItemsFn?: GalleryRequestRenderItemsFn;
}

