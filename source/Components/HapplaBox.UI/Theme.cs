using HapplaBox.UI.WinApi;
using System.Windows;
using System.Windows.Media;

namespace HapplaBox.UI
{
    public class Theme
    {
        public SolidColorBrush Accent { get; private set; }

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
            this.Accent = WinColors.AccentBrush;

            var inactiveBrush = new SolidColorBrush(Color.FromArgb(255, 180, 180, 180));
            this.Background = WinColors.AccentAlphaBrush;
            this.BackgroundInactive = inactiveBrush;

            this.BorderWeight = new Thickness(2.5, 0, 2, 2);
            this.Border = WinColors.AccentBrush;
            this.BorderInactive = WinColors.AccentAlphaBrush;

            this.TitleBar = WinColors.AccentAlphaBrush;
            this.TitleBarInactive = inactiveBrush;
            this.TitleBarText = new SolidColorBrush(Colors.White);
            this.TitleBarTextInactive = new SolidColorBrush(Color.FromArgb(200, 0, 0, 0)); // new SolidColorBrush(Color.FromArgb(130, 255, 255, 255));

        }
    }
}
