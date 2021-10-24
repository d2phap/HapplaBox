
import '@/modules/themeListener';

import { Toolbar } from '@/pages/winMain/toolbar';
import { Gallery } from '@/pages/winMain/gallery';
import { Viewport } from '@/pages/winMain/viewport';
import { pause } from '@/utils';


(async function () {
  Toolbar.initialize();
  Gallery.initialize();
  Viewport.initialize();

  console.log(Toolbar.el.clientHeight, Gallery.el.clientHeight);

  pause(0).then(Toolbar.load);
  await pause(0).then(Gallery.load);

  Gallery.el.scrollToIndex(30);
  Gallery.el.selectItems([5, 30]);
})();
