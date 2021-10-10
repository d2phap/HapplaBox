import { IRect } from './types';

export const checkRectanglesIntersection = (rectangle1: IRect, rectangle2: IRect) => !(
  rectangle2.left > rectangle1.right
  || rectangle2.right < rectangle1.left
  || rectangle2.top > rectangle1.bottom
  || rectangle2.bottom < rectangle1.top
);
