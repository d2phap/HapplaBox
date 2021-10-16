
namespace HapplaBox.Base
{
    public static class WebMessageCodes
    {

        #region Messages sent from UI

        public static readonly string UI_SystemThemeChanged = "UI_SystemThemeChanged";

        // Menu > File
        public static readonly string UI_OpenFile = "UI_OpenFile";
        public static readonly string UI_OpenFromClipboard = "UI_OpenFromClipboard";
        public static readonly string UI_OpenWith = "UI_OpenWith";
        public static readonly string UI_Refresh = "UI_Refresh";
        public static readonly string UI_Print = "UI_Print";

        // Menu > Navigation
        public static readonly string UI_ViewNext = "UI_ViewNext";
        public static readonly string UI_ViewPrevious = "UI_ViewPrevious";
        public static readonly string UI_GoTo = "UI_GoTo";

        // Menu > Zoom
        public static readonly string UI_SetZoomMode = "UI_SetZoomMode";
        public static readonly string UI_SetZoomValue = "UI_SetZoomValue";

        // Menu > Image
        public static readonly string UI_Rename = "UI_Rename";
        public static readonly string UI_MoveToRecycleBin = "UI_MoveToRecycleBin";
        public static readonly string UI_DeleteFromHardDisk = "UI_DeleteFromHardDisk";
        public static readonly string UI_SetDesktopBackground = "UI_SetDesktopBackground";
        public static readonly string UI_SetLockScreenBackground = "UI_SetLockScreenBackground";
        public static readonly string UI_OpenFileLocation = "UI_OpenFileLocation";
        public static readonly string UI_ShowFileProperties = "UI_ShowFileProperties";

        // Menu > Clipboard
        public static readonly string UI_CopyFile = "UI_CopyFile";
        public static readonly string UI_CopyImageData = "UI_CopyImageData";
        public static readonly string UI_CutFile = "UI_CutFile";
        public static readonly string UI_CopyPath = "UI_CopyPath";
        public static readonly string UI_ClearClipboard = "UI_ClearClipboard";

        // Menu > Layout
        public static readonly string UI_SetWindowMode = "UI_SetWindowMode";
        public static readonly string UI_ToggleToolbar = "UI_ToggleToolbar";
        public static readonly string UI_ToggleGallery = "UI_ToggleGallery";
        public static readonly string UI_ToggleCheckerboard = "UI_ToggleCheckerboard";
        public static readonly string UI_ToggleWindowTopMost = "UI_ToggleWindowTopMost";

        // Menu > Help
        public static readonly string UI_OpenAboutWindow = "UI_OpenAboutWindow";
        public static readonly string UI_CheckForUpdate = "UI_CheckForUpdate";
        public static readonly string UI_SendFeedback = "UI_SendFeedback";

        // Menu
        public static readonly string UI_ExitApp = "UI_ExitApp";

        #endregion


        #region Messages sent from Backend

        public static readonly string BE_LoadFile = "BE_LoadFile";

        #endregion

    }
}
