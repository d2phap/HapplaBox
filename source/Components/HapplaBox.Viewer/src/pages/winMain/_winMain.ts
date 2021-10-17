
import '@/modules/themeListener';

import { Toolbar } from '@/pages/winMain/toolbar';
import { Gallery } from '@/pages/winMain/gallery';
import { Viewer } from '@/pages/winMain/viewer';
import { pause } from '@/utils';


(async function () {
  pause(0).then(Viewer.initialize);

  pause(0).then(Toolbar.initialize);

  await pause(0).then(Gallery.initialize);
  Gallery.el.scrollToIndex(30);
  Gallery.el.selectItems([5, 30]);
})();
