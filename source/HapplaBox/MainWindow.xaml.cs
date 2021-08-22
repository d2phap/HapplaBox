using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Automation.Provider;
using Microsoft.UI.Xaml.Controls;
using System.ComponentModel;
using WinRT;
using static HapplaBox.App;

// To learn more about WinUI, the WinUI project structure,
// and more about our project templates, see: http://aka.ms/winui-project-info.

namespace HapplaBox
{
    /// <summary>
    /// An empty window that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainWindow : Window
    {
        public System.IntPtr Handle { get => this.As<IWindowNative>().WindowHandle; }

        public MainWindow()
        {
            this.InitializeComponent();
            InitWebview2();

        }
        

        private void InitWebview2()
        {
            _ = Web2.EnsureCoreWebView2Async();
           
        }

        private void Web2_CoreWebView2Initialized(WebView2 sender, CoreWebView2InitializedEventArgs args)
        {
            Web2.CoreWebView2.Settings.IsZoomControlEnabled = false;
            Web2.CoreWebView2.Settings.IsStatusBarEnabled = false;
            Web2.CoreWebView2.Settings.IsBuiltInErrorPageEnabled = false;
            Web2.CoreWebView2.Settings.AreDefaultScriptDialogsEnabled = false;
            Web2.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;

            //Title = "HapplaBox v" + Web2.CoreWebView2.Environment.BrowserVersionString;

            Web2.Source = new System.Uri(@"D:\_GITHUB\HapplaBox\source\Components\HapplaBox.Viewer\public\viewer.html");

        }
    }
}
