using HapplaBox.UI.WinApi;
using System.Windows;
using System.Windows.Media;

namespace HapplaBox.UI
{
    public class Theme
    {
        public SolidColorBrush Background { get; private set; }
        public SolidColorBrush BackgroundInactive { get; private set; }

        public SolidColorBrush TitleBar { get; private set; }
        public SolidColorBrush TitleBarInactive { get; private set; }
        public SolidColorBrush TitleBarText { get; private set; }
        public SolidColorBrush TitleBarTextInactive { get; private set; }

        public Thickness BorderWeight { get; private set; }
        public SolidColorBrush Border { get; private set; }
        public SolidColorBrush BorderInactive { get; private set; }


        public Theme()
        {
            this.Update();
        }

        public void Update()
        {
            this.Background = WinColors.AccentAlphaBrush;
            this.BackgroundInactive = WinColors.AccentBrush;
            //this.BackgroundInactive.Opacity = 0.9;

            this.BorderWeight = new Thickness(0.9);
            this.Border = WinColors.AccentBrush;
            this.BorderInactive = WinColors.AccentAlphaBrush;

            this.TitleBar = WinColors.AccentAlphaBrush;
            //this.TitleBar.Opacity = 0.5;
            this.TitleBarInactive = WinColors.AccentBrush;
            this.TitleBarText = new SolidColorBrush(Colors.White);
            this.TitleBarTextInactive = new SolidColorBrush(Color.FromArgb(130, 255, 255, 255));
        }
    }
}
