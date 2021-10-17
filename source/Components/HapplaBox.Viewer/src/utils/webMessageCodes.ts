
const uiMessages = {
  UI_SystemThemeChanged: 'UI_SystemThemeChanged',

  // Menu > File
  UI_OpenFile: 'UI_OpenFile',
  UI_OpenFromClipboard: 'UI_OpenFromClipboard',
  UI_OpenWith: 'UI_OpenWith',
  UI_Refresh: 'UI_Refresh',
  UI_Print: 'UI_Print',

  // Menu > Navigation
  UI_ViewNext: 'UI_ViewNext',
  UI_ViewPrevious: 'UI_ViewPrevious',
  UI_GoTo: 'UI_GoTo',

  // Menu > Zoom
  UI_SetZoomMode: 'UI_SetZoomMode',
  UI_SetZoomValue: 'UI_SetZoomValue',

  // Menu > Image
  UI_Rename: 'UI_Rename',
  UI_MoveToRecycleBin: 'UI_MoveToRecycleBin',
  UI_DeleteFromHardDisk: 'UI_DeleteFromHardDisk',
  UI_SetDesktopBackground: 'UI_SetDesktopBackground',
  UI_SetLockScreenBackground: 'UI_SetLockScreenBackground',
  UI_OpenFileLocation: 'UI_OpenFileLocation',
  UI_ShowFileProperties: 'UI_ShowFileProperties',

  // Menu > Clipboard
  UI_CopyFile: 'UI_CopyFile',
  UI_CopyImageData: 'UI_CopyImageData',
  UI_CutFile: 'UI_CutFile',
  UI_CopyPath: 'UI_CopyPath',
  UI_ClearClipboard: 'UI_ClearClipboard',

  // Menu > Layout
  UI_SetWindowMode: 'UI_SetWindowMode',
  UI_ToggleToolbar: 'UI_ToggleToolbar',
  UI_ToggleGallery: 'UI_ToggleGallery',
  UI_ToggleCheckerboard: 'UI_ToggleCheckerboard',
  UI_ToggleWindowTopMost: 'UI_ToggleWindowTopMost',

  // Menu > Help
  UI_OpenAboutWindow: 'UI_OpenAboutWindow',
  UI_CheckForUpdate: 'UI_CheckForUpdate',
  UI_SendFeedback: 'UI_SendFeedback',

  // Menu
  UI_OpenMainMenu: 'UI_OpenMainMenu',
  UI_ExitApp: 'UI_ExitApp',
};


const beMessages = {
  BE_LoadFile: 'BE_LoadFile',
};


export default {
  ...uiMessages,
  ...beMessages,
};
