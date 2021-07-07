using System;
using System.Runtime.InteropServices;
using System.Windows;


namespace HapplaBox.UI.WinAPI
{
    public static class SystemParametersFix
    {

        [DllImport("user32.dll")]
        private static extern int ReleaseDC(IntPtr hWnd, IntPtr hDC);

        [DllImport("user32.dll")]
        private static extern IntPtr GetDC(IntPtr hwnd);

        [DllImport("gdi32.dll")]
        private static extern int GetDeviceCaps(IntPtr hdc, int nIndex);

        [DllImport("user32.dll")]
        private static extern int GetSystemMetrics(GetSystemMetricsIndex nIndex);

        private enum GetDeviceCapsIndex
        {
            LOGPIXELSX = 88,
            LOGPIXELSY = 90
        }

        private enum GetSystemMetricsIndex
        {
            CXFRAME = 32,
            CYFRAME = 33,
            SM_CXPADDEDBORDER = 92
        }


        /// <summary>
        /// Gets the correct value of Window resize border thickness
        /// </summary>
        public static Thickness WindowResizeBorderThickness
        {
            get
            {
                float dpix = GetDpi(GetDeviceCapsIndex.LOGPIXELSX);
                float dpiy = GetDpi(GetDeviceCapsIndex.LOGPIXELSY);

                int dx = GetSystemMetrics(GetSystemMetricsIndex.CXFRAME);
                int dy = GetSystemMetrics(GetSystemMetricsIndex.CYFRAME);

                // this adjustment is needed only since .NET 4.5 
                int d = GetSystemMetrics(GetSystemMetricsIndex.SM_CXPADDEDBORDER);
                dx += d;
                dy += d;

                var leftBorder = dx / dpix;
                var topBorder = dy / dpiy;

                return new Thickness(leftBorder, topBorder, leftBorder, topBorder);
            }
        }

        private static float GetDpi(GetDeviceCapsIndex index)
        {
            IntPtr desktopWnd = IntPtr.Zero;
            IntPtr dc = GetDC(desktopWnd);
            float dpi;

            try
            {
                dpi = GetDeviceCaps(dc, (int)index);
            }
            finally
            {
                ReleaseDC(desktopWnd, dc);
            }

            return dpi / 96f;
        }


    }
}
