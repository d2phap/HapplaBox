using System;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Interop;

namespace HapplaBox.UI.WinApi
{
    internal enum AccentState
    {
        ACCENT_DISABLED = 1,
        ACCENT_ENABLE_GRADIENT = 0,
        ACCENT_ENABLE_TRANSPARENTGRADIENT = 2,
        ACCENT_ENABLE_BLURBEHIND = 3,
        ACCENT_INVALID_STATE = 4
    }

    [StructLayout(LayoutKind.Sequential)]
    internal struct AccentPolicy
    {
        public AccentState AccentState;
        public int AccentFlags;
        public int GradientColor;
        public int AnimationId;
    }

    [StructLayout(LayoutKind.Sequential)]
    internal struct WindowCompositionAttributeData
    {
        public WindowCompositionAttribute Attribute;
        public IntPtr Data;
        public int SizeOfData;
    }

    internal enum WindowCompositionAttribute
    {
        WCA_ACCENT_POLICY = 19
    }


    /// <summary>
    /// Provides helpers functions for Windows Aero Glass effect.
    /// </summary>
    public static class AeroGlass
    {

        [DllImport("user32.dll")]
        internal static extern int SetWindowCompositionAttribute(IntPtr hwnd, ref WindowCompositionAttributeData data);

        [DllImport("dwmapi.dll", PreserveSig = false)]
        public static extern bool DwmIsCompositionEnabled();


        /// <summary>
        /// Checks if Aero Glass effect is enabled or not.
        /// </summary>
        /// <returns></returns>
        public static bool IsAeroGlassEnabled => Environment.OSVersion.Version.Major >= 6 && DwmIsCompositionEnabled();


        /// <summary>
        /// Apply Aero Glass effect to Window.
        /// </summary>
        /// <param name="win"></param>
        public static void Apply(Window win)
        {
            if (!IsAeroGlassEnabled)
            {
                return;
            }

            var windowHelper = new WindowInteropHelper(win);
            var accent = new AccentPolicy
            {
                AccentState = AccentState.ACCENT_ENABLE_BLURBEHIND
            };

            var accentStructSize = Marshal.SizeOf(accent);
            var accentPtr = Marshal.AllocHGlobal(accentStructSize);
            Marshal.StructureToPtr(accent, accentPtr, false);

            var data = new WindowCompositionAttributeData
            {
                Attribute = WindowCompositionAttribute.WCA_ACCENT_POLICY,
                SizeOfData = accentStructSize,
                Data = accentPtr
            };

            SetWindowCompositionAttribute(windowHelper.Handle, ref data);
            Marshal.FreeHGlobal(accentPtr);
        }
    }
}
