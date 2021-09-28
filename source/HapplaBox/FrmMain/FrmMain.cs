using HapplaBox.Base;
using HapplaBox.UI;
using Microsoft.Web.WebView2.Core;
using System;
using System.Drawing;
using System.Dynamic;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace HapplaBox
{
    internal partial class FrmMain : Form
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
            var msg = e.WebMessageAsJson;
            var json = Json.Parse<string>(msg);

            if (json?.Name == "system-theme-changed")
            {
                bool isLightTheme = json?.Data == "light";

                if (isLightTheme)
                {
                    UpdateTheme(SystemTheme.Light);
                }
                else
                {
                    UpdateTheme(SystemTheme.Dark);
                }
            }
        }

        private async void Web2_CoreWebView2InitializationCompleted(object sender, CoreWebView2InitializationCompletedEventArgs e)
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

            await Task.Delay(5000);
            Web2.CoreWebView2.PostWebMessageAsString("{\"phap\": \"duong\"}");
        }

        private void Web2_NavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            UpdateWebviewTheme();
        }

    }
}
