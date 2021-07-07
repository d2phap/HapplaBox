using System;
using System.Runtime.InteropServices;
using System.Windows.Media;

namespace HapplaBox.UI.WinApi
{
    public class WinColors
    {
        [DllImport("dwmapi.dll", EntryPoint = "#127", PreserveSig = false)]
        private static extern void DwmGetColorizationParameters(out DWM_COLORIZATION_PARAMS parameters);

        private struct DWM_COLORIZATION_PARAMS
        {
            public uint clrColor;
            public uint clrAfterGlow;
            public uint nIntensity;
            public uint clrAfterGlowBalance;
            public uint clrBlurBalance;
            public uint clrGlassReflectionIntensity;
            public bool fOpaque;
        }

        private static SolidColorBrush GetAccentBrush(bool includeAlpha = false)
        {
            var temp = new DWM_COLORIZATION_PARAMS();
            DwmGetColorizationParameters(out temp);

            var bytes = BitConverter.GetBytes(temp.clrAfterGlow);
            var alpha = includeAlpha ? bytes[3] : (byte)255;
            var color = Color.FromArgb(alpha, bytes[2], bytes[1], bytes[0]);

            return new SolidColorBrush(color);
        }


        public static SolidColorBrush AccentBrush => GetAccentBrush();

        public static SolidColorBrush AccentAlphaBrush => GetAccentBrush(true);


    }
}
