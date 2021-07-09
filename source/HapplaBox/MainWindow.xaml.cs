using HapplaBox.Settings;
using System;
using System.Windows;

namespace HapplaBox
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            // Load settings from config file
            Config.Load();
            InitializeComponent();
            InitializeAsync();

            StateChanged += MainWindowChrome_StateChangeRaised;
            Deactivated += MainWindowTheme_Deactivated;
            Activated += MainWindowTheme_Activated;
            Loaded += MainWindowTheme_Loaded;

            Loaded += MainWindow_Loaded;
            Closing += MainWindow_Closing;
        }

        private void MainWindow_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            // save WinMain placement
            var win = new WindowSettings();
            var wp = win.GetPlacementFromWindow(this);
            win.SetWinMainPlacementConfig(wp);


            // write all settings to file
            Config.Write();
        }

        private void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            // load window placement from settings
            var win = new WindowSettings();
            win.SetPlacementToWindow(this, win.GetWinMainPlacementFromConfig());
        }

        private async void InitializeAsync()
        {
            await Web2.EnsureCoreWebView2Async();

            Title = "HapplaBox " + Web2.CoreWebView2.Environment.BrowserVersionString;
            Web2.Source = new Uri(@"D:\_GITHUB\happla\docs\index.html");
        }
    }
}
