using HapplaBox.Settings;

namespace HapplaBox
{
    public partial class FrmMain
    {
        private void SetUpFrmMainConfigs()
        {
            this.Load += FrmMainConfig_Load;
            this.FormClosing += FrmMainConfig_FormClosing;
            this.SizeChanged += FrmMainConfig_SizeChanged;
        }

        private void FrmMainConfig_SizeChanged(object? sender, EventArgs e)
        {
            Config.FrmMainPositionX = this.Location.X;
            Config.FrmMainPositionY = this.Location.Y;
            Config.FrmMainWidth = this.Size.Width;
            Config.FrmMainHeight = this.Size.Height;
        }

        private void FrmMainConfig_Load(object? sender, EventArgs e)
        {
            this.TopMost = Config.IsAlwaysOnTop;

            // load window placement from settings
            var win = new WindowSettings();
            win.SetPlacementToWindow(this, win.GetFrmMainPlacementFromConfig());
        }

        private void FrmMainConfig_FormClosing(object? sender, FormClosingEventArgs e)
        {
            // save WinMain placement
            var win = new WindowSettings();
            var wp = win.GetPlacementFromWindow(this);
            win.SetFrmMainPlacementConfig(wp);


            Config.Write();
        }
    }
}
