﻿using Microsoft.UI.Xaml;
using System;
using System.Runtime.InteropServices;
using WinRT;

namespace HapplaBox.Settings
{
    /// <summary>
    /// Provides extra and correct settings for Window
    /// </summary>
    public class WindowSettings
    {
        [DllImport("user32.dll")]
        private static extern bool SetWindowPlacement(IntPtr hWnd, [In] ref WindowPlacement lpwndpl);

        [DllImport("user32.dll")]
        private static extern bool GetWindowPlacement(IntPtr hWnd, out WindowPlacement lpwndpl);


        [ComImport]
        [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
        [Guid("EECDBF0E-BAE9-4CB6-A68E-9598E1CB57BB")]
        public interface IWindowNative
        {
            IntPtr WindowHandle { get; }
        }

        #region General window placement get/set functions
        /// <summary>
        /// Gets placement value of the given window using WinAPI
        /// </summary>
        /// <param name="win">A window</param>
        /// <returns></returns>
        public WindowPlacement GetPlacementFromWindow(Window win)
        {
            var handle = win.As<IWindowNative>().WindowHandle;
            _ = GetWindowPlacement(handle, out WindowPlacement wp);

            return wp;
        }


        /// <summary>
        /// Sets placement to Window using WinAPI.
        /// Load window placement details for previous application session from app settings.
        /// Note: If window was closed on a monitor that is now disconnected from the computer,
        ///       this function will place the window onto a visible monitor.
        /// </summary>
        /// <param name="win">A window</param>
        public void SetPlacementToWindow(Window win, WindowPlacement wp)
        {
            // change window state 'Minimized' to 'Normal'
            wp.showCmd = wp.showCmd == WindowState.Minimized ? WindowState.Normal : wp.showCmd;

            try
            {
                var handle = win.As<IWindowNative>().WindowHandle;
                _ = SetWindowPlacement(handle, ref wp);
            }
            catch { }
        }

        #endregion


        #region WinMain placement

        /// <summary>
        /// Updates the given WindowPlacement object to WinMain config
        /// </summary>
        /// <param name="wp"></param>
        public void SetWinMainPlacementConfig(WindowPlacement wp)
        {
            Config.WinMainPositionX = wp.normalPosition.Left;
            Config.WinMainPositionY = wp.normalPosition.Top;
            Config.WinMainWidth = wp.normalPosition.Right - wp.normalPosition.Left;
            Config.WinMainHeight = wp.normalPosition.Bottom - wp.normalPosition.Top;

            Config.WinMainState = wp.showCmd;
        }


        /// <summary>
        /// Retrieves WindowPlacement object from WinMain config
        /// </summary>
        /// <returns></returns>
        public WindowPlacement GetWinMainPlacementFromConfig()
        {
            return new WindowPlacement(new Rect(
                Config.WinMainPositionX,
                Config.WinMainPositionY,
                Config.WinMainPositionX + Config.WinMainWidth,
                Config.WinMainPositionY + Config.WinMainHeight
              ), Config.WinMainState);
        }

        #endregion

    }

}
