using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace HapplaBox
{
    public partial class FrmMain: Form
    {
        public void SetUpFrmMainTheme()
        {
            this.Load += FrmMainTheme_Load;
        }


        public enum WindowsTheme
        {
            Unknown,
            Light,
            Dark
        }


        private void FrmMainTheme_Load(object? sender, EventArgs e)
        {
            UpdateTheme();
        }


        private void UpdateTheme(WindowsTheme theme = WindowsTheme.Unknown)
        {
            var newTheme = theme;

            if (theme == WindowsTheme.Unknown)
            {
                newTheme = GetWindowsThemeMode();
            }

            if (newTheme == WindowsTheme.Light)
            {
                this.BackColor = Color.FromArgb(255, 237, 245, 249);
            }
            else
            {
                this.BackColor = Color.FromArgb(255, 26, 34, 39);
            }
        }

        public WindowsTheme GetWindowsThemeMode()
        {
            const string regPath = @"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize";
            const string regKeyAppTheme = "AppsUseLightTheme";

            using var key = Registry.CurrentUser.OpenSubKey(regPath);
            var regValue = key?.GetValue(regKeyAppTheme);
            var themeMode = WindowsTheme.Dark;

            if (regValue != null)
            {
                var themeValue = (int)regValue;

                if (themeValue > 0)
                {
                    themeMode = WindowsTheme.Light;
                }
            }


            return themeMode;
        }
    }
}
