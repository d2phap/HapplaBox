using HapplaBox.Base;
using HapplaBox.Settings;
using HapplaBox.UI;
using Microsoft.Web.WebView2.Core;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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

            _ = InitWebview2();
        }

        private async Task InitWebview2()
        {
            var options = new CoreWebView2EnvironmentOptions
            {
                AdditionalBrowserArguments = "--disable-web-security --allow-file-access-from-files --allow-file-access",
            };

            var env = await CoreWebView2Environment.CreateAsync(userDataFolder: MyApp.ConfigDir(PathType.Dir, "ViewerData"), options: options);


            await Web2.EnsureCoreWebView2Async(env);
        }

        private void Web2_CoreWebView2InitializationCompleted(object sender, CoreWebView2InitializationCompletedEventArgs e)
        {
            this.Text += " " + Web2.CoreWebView2.Environment.BrowserVersionString;
            IsWeb2Ready = true;

            Web2.CoreWebView2.Settings.IsZoomControlEnabled = false;
            Web2.CoreWebView2.Settings.IsStatusBarEnabled = false;
            Web2.CoreWebView2.Settings.IsBuiltInErrorPageEnabled = false;
            Web2.CoreWebView2.Settings.IsGeneralAutofillEnabled = false;
            Web2.CoreWebView2.Settings.IsPasswordAutosaveEnabled = false;
            Web2.CoreWebView2.Settings.IsPinchZoomEnabled = false;
            Web2.CoreWebView2.Settings.IsSwipeNavigationEnabled = false;
            Web2.CoreWebView2.Settings.AreDefaultScriptDialogsEnabled = false;
            Web2.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
            //Web2.CoreWebView2.Settings.AreBrowserAcceleratorKeysEnabled = false;

            Web2.CoreWebView2.WebMessageReceived += CoreWebView2_WebMessageReceived;

            Web2.Source = new Uri(@"D:\_GITHUB\HapplaBox\source\Components\HapplaBox.Viewer\public\winMain.html");

            //Web2.CoreWebView2.OpenDevToolsWindow();
        }


        private void Web2_NavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            UpdateWebviewTheme();

            LoadPath();
        }


        private void CoreWebView2_WebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            var msg = e.WebMessageAsJson;
            var json = WebMessage.FromJson<object>(msg);

            if (json?.Code == WebMessageCodes.UI_SystemThemeChanged)
            {
                bool isLightTheme = json?.Data?.ToString() == "light";

                if (isLightTheme)
                {
                    UpdateTheme(SystemTheme.Light);
                }
                else
                {
                    UpdateTheme(SystemTheme.Dark);
                }
            }
            else if (json?.Code == WebMessageCodes.UI_RequestGalleryThumbnailUpdate)
            {
                var arr = JsonSerializer.Deserialize<int[]>(json?.Data?.ToString() ?? "[]");

                Local.GallerySvc.AddToQueue(arr ?? Array.Empty<int>());
            }
        }


        private void LoadPath(string path = "")
        {
            var filename = string.Empty;
            IEnumerable<string>? allFiles = null;

            // load path from command-line arguments
            if (string.IsNullOrEmpty(path))
            {
                var args = Environment.GetCommandLineArgs();
                if (args.Length >= 2)
                {
                    path = args.LastOrDefault() ?? "";
                }
            }

            if (File.Exists(path))
            {
                var dir = Path.GetDirectoryName(path);
                allFiles = Directory.EnumerateFiles(dir ?? "");
                filename = path;
            }
            else if(Directory.Exists(path))
            {
                allFiles = Directory.EnumerateFiles(path);
                filename = allFiles.FirstOrDefault();
            }

            if (!string.IsNullOrEmpty(filename))
            {
                var url = new Uri(filename).AbsoluteUri;
                var msgJson = WebMessage.ToJson(WebMessageCodes.BE_LoadFile, url);

                Web2.CoreWebView2.PostWebMessageAsString(msgJson);
                this.Text = "HapplaBox " + Web2.CoreWebView2.Environment.BrowserVersionString +
                    $" {filename}";
            }


            LoadThumbnails(allFiles);
        }


        private void LoadThumbnails(IEnumerable<string>? allFiles)
        {
            Local.ImgList = new(Config.DefaultCodec, allFiles?.ToList() ?? new(0));

            Local.GallerySvc?.Dispose();
            Local.GallerySvc = new(Config.DefaultCodec, Local.ImgList);
            Local.GallerySvc.ItemRenderedHandler = ItemRenderedEvent;


            var thumbnailList = allFiles?.Select((f, i) => new
            {
                Filename = new Uri(f).AbsoluteUri,
                Name = Path.GetFileName(f),
                Tooltip = $"[{i}] {f}",
            });

            var msgJson = WebMessage.ToJson(WebMessageCodes.BE_LoadList, thumbnailList);

            Web2.CoreWebView2.PostWebMessageAsString(msgJson);

            GC.SuppressFinalize(this);
            GC.Collect();
        }

        private void ItemRenderedEvent(int index)
        {
            if (this.InvokeRequired)
            {
                this.Invoke(ItemRenderedEvent, index);
                return;
            }

            var payload = new
            {
                Index = index,
                Thumbnail = Local.GallerySvc.Get(index),
            };

            var msgJson = WebMessage.ToJson(WebMessageCodes.BE_UpdateGalleryItemThumbnail, payload);


            Web2.CoreWebView2.PostWebMessageAsString(msgJson);
        }


    }
}
