using HapplaBox.UI;
using HapplaBox.UI.WinApi;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Media.Animation;

namespace HapplaBox
{
    public partial class MainWindow
    {
        private const int WM_DWMCOLORIZATIONCOLORCHANGED = 0x0320;
        private Theme CurrentTheme = new();


        private void UpdateTheme()
        {
            // update current theme using system variables
            CurrentTheme.Update();

            if (this.IsActive)
            {
                MainWindowTheme_Activated(this, null);
            }
            else
            {
                MainWindowTheme_Deactivated(this, null);
            }


            WinMainBorder.BorderThickness = CurrentTheme.BorderWeight;
        }

        private void MainWindowTheme_Activated(object sender, EventArgs e)
        {
            var bgColor = CurrentTheme.Background.Color;
            if (!AeroGlass.IsAeroGlassEnabled)
            {
                bgColor = Color.FromArgb(255,
                    CurrentTheme.Background.Color.R,
                    CurrentTheme.Background.Color.G,
                    CurrentTheme.Background.Color.B);
            }
            AnimateBackground(AppArea, CurrentTheme.BackgroundInactive.Color, bgColor);
            AnimateBackground(WinTitleBar, WinTitleBar.Background, CurrentTheme.TitleBar);

            WinMainBorder.BorderBrush = CurrentTheme.Border;
            WinTitleText.Foreground =
              WinBtnMinimize.Foreground =
              WinBtnMaximize.Foreground =
              WinBtnRestore.Foreground =
              WinBtnClose.Foreground = CurrentTheme.TitleBarText;
        }

        private void MainWindowTheme_Deactivated(object sender, EventArgs e)
        {
            var bgColor = CurrentTheme.BackgroundInactive.Color;
            if (!AeroGlass.IsAeroGlassEnabled)
            {
                bgColor = Color.FromArgb(255,
                    CurrentTheme.BackgroundInactive.Color.R,
                    CurrentTheme.BackgroundInactive.Color.G,
                    CurrentTheme.BackgroundInactive.Color.B);
            }
            AnimateBackground(AppArea, CurrentTheme.Background.Color, bgColor);
            AnimateBackground(WinTitleBar, WinTitleBar.Background, CurrentTheme.TitleBarInactive);

            WinMainBorder.BorderBrush = CurrentTheme.BorderInactive;
            WinTitleText.Foreground =
              WinBtnMinimize.Foreground =
              WinBtnMaximize.Foreground =
              WinBtnRestore.Foreground =
              WinBtnClose.Foreground = CurrentTheme.TitleBarTextInactive;
        }

        private void MainWindowTheme_Loaded(object sender, RoutedEventArgs e)
        {
            AeroGlass.Apply(this);
            UpdateTheme();
            UpdateWindowChrome();

            var source = HwndSource.FromHwnd(new WindowInteropHelper(this).Handle);
            source.AddHook(new HwndSourceHook(WndProc));
        }


        private IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        {
            if (msg == WM_DWMCOLORIZATIONCOLORCHANGED)
            {
                UpdateTheme();
            }

            return IntPtr.Zero;
        }


        private void AnimateBackground(Grid control, Color from, Color to)
        {
            var ca = new ColorAnimation(from, to, new(TimeSpan.FromMilliseconds(200)));

            control.Background = new SolidColorBrush(from);
            control.Background.BeginAnimation(SolidColorBrush.ColorProperty, ca);
        }

        private void AnimateBackground(Grid control, Brush from, Brush to)
        {
            if (from is null || to is null)
            {
                control.Background = to;
                return;
            }

            var fromBrush = from.Clone() as SolidColorBrush;
            var toBrush = to.Clone() as SolidColorBrush;

            var ca = new ColorAnimation(fromBrush.Color, toBrush.Color,
                new(TimeSpan.FromMilliseconds(200)));

            control.Background = from.Clone();
            control.Background.BeginAnimation(SolidColorBrush.ColorProperty, ca);
        }
    }
}
