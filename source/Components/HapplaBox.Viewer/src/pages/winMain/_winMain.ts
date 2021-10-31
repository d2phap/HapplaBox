
import '@/modules/themeListener';

import { Toolbar } from '@/pages/winMain/toolbar';
import { Gallery } from '@/pages/winMain/gallery';
import { Viewport } from '@/pages/winMain/viewport';
import { pause } from '@/utils';


(async function () {
  Toolbar.initialize();
  Gallery.initialize();
  Viewport.initialize();

  pause(0).then(Toolbar.load);
})();
