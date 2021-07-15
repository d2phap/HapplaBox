using HapplaBox.Base;
using HapplaBox.Settings;
using Microsoft.Web.WebView2.Core;
using System;
using System.Threading.Tasks;
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
            var options = new CoreWebView2EnvironmentOptions
            {
                AdditionalBrowserArguments = "--disable-web-security --allow-file-access-from-files --allow-file-access",
            };
            var env = await CoreWebView2Environment.CreateAsync(userDataFolder: MyApp.ConfigDir(PathType.Dir, "ViewerData"), options: options);
            await Web2.EnsureCoreWebView2Async(env);

            Web2.CoreWebView2.Settings.IsZoomControlEnabled = false;
            Web2.CoreWebView2.Settings.IsStatusBarEnabled = false;
            Web2.CoreWebView2.Settings.IsBuiltInErrorPageEnabled = false;
            Web2.CoreWebView2.Settings.AreDefaultScriptDialogsEnabled = false;
            Web2.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
            //Web2.CoreWebView2.Settings.AreBrowserAcceleratorKeysEnabled = false;

            Title = "HapplaBox " + Web2.CoreWebView2.Environment.BrowserVersionString;


            Web2.Source = new Uri(@"D:\_GITHUB\HapplaBox\source\Components\HapplaBox.Viewer\public\viewer.html");
        }

    }
}
