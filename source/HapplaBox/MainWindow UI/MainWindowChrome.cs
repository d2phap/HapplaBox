using HapplaBox.UI.WinAPI;
using System;
using System.Windows;
using System.Windows.Input;
using System.Windows.Shell;

namespace HapplaBox
{
    public partial class MainWindow
    {
        private readonly Thickness WINDOW_BORDER = new(0.9);


        #region Custom Window Chrome
        // Can execute
        private void CmdBinding_CanExecute(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = true;
        }

        // Minimize
        private void CmdBinding_Executed_Minimize(object sender, ExecutedRoutedEventArgs e)
        {
            SystemCommands.MinimizeWindow(this);
        }

        // Maximize
        private void CmdBinding_Executed_Maximize(object sender, ExecutedRoutedEventArgs e)
        {
            SystemCommands.MaximizeWindow(this);
        }

        // Restore
        private void CmdBinding_Executed_Restore(object sender, ExecutedRoutedEventArgs e)
        {
            SystemCommands.RestoreWindow(this);
        }

        // Close
        private void CmdBinding_Executed_Close(object sender, ExecutedRoutedEventArgs e)
        {
            SystemCommands.CloseWindow(this);
        }

        // State change
        private void MainWindowChrome_StateChangeRaised(object sender, EventArgs e)
        {
            if (WindowState == WindowState.Maximized)
            {
                WinMainBorder.BorderThickness = SystemParametersFix.WindowResizeBorderThickness;
                WinBtnRestore.Visibility = Visibility.Visible;
                WinBtnMaximize.Visibility = Visibility.Collapsed;
                AppArea.BorderThickness = new Thickness(0);
            }
            else
            {
                WinMainBorder.BorderThickness = WINDOW_BORDER;
                WinBtnRestore.Visibility = Visibility.Collapsed;
                WinBtnMaximize.Visibility = Visibility.Visible;
                AppArea.BorderThickness = CurrentTheme.BorderWeight;
            }

            UpdateWindowChrome();
        }
        #endregion


        public void UpdateWindowChrome()
        {
            var chrome = WindowChrome.GetWindowChrome(this);
            chrome.CaptionHeight = WinTitleBar.ActualHeight - chrome.ResizeBorderThickness.Top + WinMainBorder.BorderThickness.Top;
        }
    }
}
