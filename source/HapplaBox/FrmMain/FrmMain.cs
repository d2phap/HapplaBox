using HapplaBox.UI;
using Microsoft.Web.WebView2.Core;
using System;
using System.Drawing;
using System.Windows.Forms;

namespace HapplaBox
{
    public partial class FrmMain : Form
    {
        private bool IsWeb2Ready { get; set; } = false;

        public FrmMain()
        {
            InitializeComponent();
            SetUpFrmMainConfigs();
            SetUpFrmMainTheme();

            _ = Web2.EnsureCoreWebView2Async();
            
        }

        private void CoreWebView2_WebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            var themeMsg = e.TryGetWebMessageAsString();
            var isLightTheme = themeMsg == "light";

            if (isLightTheme)
            {
                UpdateTheme(SystemTheme.Light);
            }
            else
            {
                UpdateTheme(SystemTheme.Dark);
            }
        }

        private void Web2_CoreWebView2InitializationCompleted(object sender, CoreWebView2InitializationCompletedEventArgs e)
        {
            IsWeb2Ready = true;

            Web2.CoreWebView2.Settings.IsZoomControlEnabled = false;
            Web2.CoreWebView2.Settings.IsStatusBarEnabled = false;
            Web2.CoreWebView2.Settings.IsBuiltInErrorPageEnabled = false;
            Web2.CoreWebView2.Settings.IsGeneralAutofillEnabled = false;
            Web2.CoreWebView2.Settings.IsPasswordAutosaveEnabled = false;
            Web2.CoreWebView2.Settings.IsPinchZoomEnabled = false;
            Web2.CoreWebView2.Settings.AreDefaultScriptDialogsEnabled = false;
            Web2.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;

            Web2.CoreWebView2.WebMessageReceived += CoreWebView2_WebMessageReceived;


            this.Text += " " + Web2.CoreWebView2.Environment.BrowserVersionString;

            Web2.Source = new Uri(@"D:\_GITHUB\HapplaBox\source\Components\HapplaBox.Viewer\public\viewer.html");
        }

        private void Web2_NavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            UpdateWebviewTheme();
        }

    }
}
