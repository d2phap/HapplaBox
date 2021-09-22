using Microsoft.Web.WebView2.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace HapplaBox
{
    public partial class FrmMain : Form
    {
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
                UpdateTheme(WindowsTheme.Light);
            }
            else
            {
                UpdateTheme(WindowsTheme.Dark);
            }
        }

        private void Web2_CoreWebView2InitializationCompleted(object sender, CoreWebView2InitializationCompletedEventArgs e)
        {
            Web2.CoreWebView2.Settings.IsZoomControlEnabled = false;
            Web2.CoreWebView2.Settings.IsStatusBarEnabled = false;
            Web2.CoreWebView2.Settings.IsBuiltInErrorPageEnabled = false;
            Web2.CoreWebView2.Settings.IsGeneralAutofillEnabled = false;
            Web2.CoreWebView2.Settings.IsPasswordAutosaveEnabled = false;
            Web2.CoreWebView2.Settings.IsPinchZoomEnabled = false;
            Web2.CoreWebView2.Settings.AreDefaultScriptDialogsEnabled = false;
            Web2.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;

            Web2.CoreWebView2.WebMessageReceived += CoreWebView2_WebMessageReceived;


            this.Text = Web2.CoreWebView2.Environment.BrowserVersionString;

            //Web2.CoreWebView2.SetVirtualHostNameToFolderMapping(
            //    "app.local",
            //    @"D:\_GITHUB\HapplaBox\source\Components\HapplaBox.Viewer\public\",
            //    CoreWebView2HostResourceAccessKind.Allow);

            //Web2.Source = new Uri("https://app.local/viewer.html");

            Web2.Source = new Uri(@"D:\_GITHUB\HapplaBox\source\Components\HapplaBox.Viewer\public\viewer.html");
        }


    }
}
