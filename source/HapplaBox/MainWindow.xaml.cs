using Microsoft.Web.WebView2.Core;
using System;
using System.Windows;
using System.Windows.Controls;

namespace HapplaBox
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            InitializeAsync();

            StateChanged += MainWindowChrome_StateChangeRaised;
            Deactivated += MainWindowTheme_Deactivated;
            Activated += MainWindowTheme_Activated;
            Loaded += MainWindowTheme_Loaded;
        }


        private async void InitializeAsync()
        {
            await web2.EnsureCoreWebView2Async();

            Title = "HapplaBox " + web2.CoreWebView2.Environment.BrowserVersionString;
            web2.Source = new Uri(@"D:\_GITHUB\happla\docs\index.html");
        }
    }
}
