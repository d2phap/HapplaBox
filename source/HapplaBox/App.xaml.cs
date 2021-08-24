using HapplaBox.Settings;
using Microsoft.UI;
using Microsoft.UI.Windowing;
using Microsoft.UI.Xaml;
using System;
using System.Runtime.InteropServices;
using WinRT;

// To learn more about WinUI, the WinUI project structure,
// and more about our project templates, see: http://aka.ms/winui-project-info.

namespace HapplaBox
{
    /// <summary>
    /// Provides application-specific behavior to supplement the default Application class.
    /// </summary>
    public partial class App : Application
    {
        // For the simplicity of this code snippet we import the DLL and declare
        // the methods in the MainWindow class here. It is recommended that you
        // break this out into a support class that you use wherever needed instead.
        // See the Windows App SDK windowing sample for more details.
        [DllImport("Microsoft.UI.Windowing.Core.dll", CharSet = CharSet.Unicode)]
        private static extern int GetWindowHandleFromWindowId(WindowId windowId, out IntPtr result);

        [DllImport("Microsoft.UI.Windowing.Core.dll", CharSet = CharSet.Unicode)]
        private static extern int GetWindowIdFromWindowHandle(IntPtr hwnd, out WindowId result);


        private Window m_window;
        public static AppWindow MainAppWindow { get; set; }
        public IntPtr MainWindowHandle { get => m_window.As<IWindowNative>().WindowHandle; }


        /// <summary>
        /// Initializes the singleton application object.  This is the first line of authored code
        /// executed, and as such is the logical equivalent of main() or WinMain().
        /// </summary>
        public App()
        {
            this.InitializeComponent();
            Config.Load();
        }

        /// <summary>
        /// Invoked when the application is launched normally by the end user.  Other entry points
        /// will be used such as when the application is launched to open a specific file.
        /// </summary>
        /// <param name="args">Details about the launch request and process.</param>
        protected override void OnLaunched(LaunchActivatedEventArgs args)
        {
            m_window = new MainWindow();
            m_window.Activate();

            // Get the AppWindow for our XAML Window
            MainAppWindow = GetAppWindowForWindow(m_window);
            MainAppWindow.Closing += MainAppWindow_Closing;
            m_window.SizeChanged += MainWindow_SizeChanged;

            var options = AppWindowConfiguration.CreateDefault();
            options.IsAlwaysOnTop = Config.IsAlwaysOnTop;

            MainAppWindow.ApplyConfiguration(options);


            // load window placement from settings
            var win = new WindowSettings();
            win.SetPlacementToWindow(m_window, win.GetWinMainPlacementFromConfig());

        }

        private void MainWindow_SizeChanged(object sender, WindowSizeChangedEventArgs args)
        {
            Config.WinMainPositionX = MainAppWindow.Position.X;
            Config.WinMainPositionY = MainAppWindow.Position.Y;
            Config.WinMainWidth = MainAppWindow.Size.Width;
            Config.WinMainHeight = MainAppWindow.Size.Height;
        }

        private void MainAppWindow_Closing(AppWindow sender, AppWindowClosingEventArgs args)
        {
            // save WinMain placement
            var win = new WindowSettings();
            var wp = win.GetPlacementFromWindow(m_window);
            win.SetWinMainPlacementConfig(wp);

            Config.Write();
        }

        private static AppWindow GetAppWindowForWindow(Window win)
        {
            var hWnd = WinRT.Interop.WindowNative.GetWindowHandle(win);
            _ = GetWindowIdFromWindowHandle(hWnd, out WindowId myWndId);

            return AppWindow.GetFromWindowId(myWndId);
        }

        private void ToggleFullscreen()
        {
            if (MainAppWindow.Presenter.Kind == AppWindowPresenterKind.Overlapped)
            {
                _ = MainAppWindow.TrySetPresenter(AppWindowPresenterKind.FullScreen);
            }
            else
            {
                _ = MainAppWindow.TrySetPresenter(AppWindowPresenterKind.Overlapped);
            }
        }


        [ComImport]
        [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
        [Guid("EECDBF0E-BAE9-4CB6-A68E-9598E1CB57BB")]
        public interface IWindowNative
        {
            IntPtr WindowHandle { get; }
        }
    }


}
