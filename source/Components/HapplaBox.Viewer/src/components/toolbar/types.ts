
export type HbToolbarItemType = 'button' | 'divider' | 'space';
export type HbToolbarGroup = 'center' | 'bottom';
export type HbToolbarClickFunc = (e: PointerEvent, itemIndex: number) => any;
export type HbToolbarRightClickFunc = (e: PointerEvent) => any;

export interface HbToolbarItem {
  type: HbToolbarItemType;
  group?: HbToolbarGroup; // center is default
  /**
   * Returns true if the item is moved to Overflow dropdown
   */
  overflow?: boolean;
}
export interface HbToolbarDivider extends HbToolbarItem {};
export interface HbToolbarButton extends HbToolbarItem {
  label: string;
  imageUrl: string;
  tooltip?: string;
  checkable?: boolean;
  isChecked?: boolean;
  disabled?: boolean;
  clickFn?: HbToolbarClickFunc;
};


export type HbToolbarPosition = 'top' | 'bottom';
export interface HbToolbarOptions {
  items: HbToolbarItem[];
  position: HbToolbarPosition;
  rightClickFn?: HbToolbarRightClickFunc;
}

