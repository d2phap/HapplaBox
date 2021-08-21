
export type HbToolbarItemType = 'button' | 'divider';
export type HbToolbarClickFunc = (e: PointerEvent) => any;
export interface HbToolbarItem {
  type: HbToolbarItemType;
}
export interface HbToolbarDivider extends HbToolbarItem {};
export interface HbToolbarButton extends HbToolbarItem {
  label: string;
  imageUrl: string;
  tooltip?: string;
  checkable?: boolean;
  disabled?: boolean;
  clickFn?: HbToolbarClickFunc;
  rightClickFn?: HbToolbarClickFunc;
};


export type HbToolbarPosition = 'top' | 'bottom' | 'left' | 'right';
export interface HbToolbarOptions {
  items: HbToolbarItem[];
  position: HbToolbarPosition;
  rightClickFn?: HbToolbarClickFunc;
}

