using HapplaBox.UI;

namespace HapplaBox
{
    public partial class FrmMain
    {
        private Theme CurrentTheme = new();

        public void SetUpFrmMainTheme()
        {
            this.Load += FrmMainTheme_Load;
        }



        private void FrmMainTheme_Load(object? sender, EventArgs e)
        {
            UpdateTheme();
        }


        private void UpdateTheme(SystemTheme theme = SystemTheme.Unknown)
        {
            var newTheme = theme;

            if (theme == SystemTheme.Unknown)
            {
                newTheme = ThemeUtils.GetSystemTheme();
            }

            if (newTheme == SystemTheme.Light)
            {
                this.BackColor = Color.FromArgb(255, 255, 255, 255);
            }
            else
            {
                this.BackColor = Color.FromArgb(255, 26, 34, 39);
            }

            UpdateWebviewTheme();
        }

        private void UpdateWebviewTheme()
        {
            if (!IsWeb2Ready) return;

            // color accent
            var color = CurrentTheme.AccentColor;
            var accentColorStr = $"{color.R} {color.G} {color.B}";

            Web2.CoreWebView2.ExecuteScriptAsync($"document.documentElement.style.setProperty('--colorAccent', '{accentColorStr}');");
        }
    }
}
