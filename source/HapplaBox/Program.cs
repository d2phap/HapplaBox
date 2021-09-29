
using System;
using System.Windows.Forms;
using HapplaBox;
using HapplaBox.Settings;

AppDomain.CurrentDomain.UnhandledException += (object sender, UnhandledExceptionEventArgs e) => HandleException((Exception)e.ExceptionObject);

ApplicationConfiguration.Initialize();
Application.SetHighDpiMode(HighDpiMode.PerMonitorV2);

// load application configs
Config.Load();

Application.Run(new FrmMain());



static void HandleException(Exception ex)
{
    TaskDialog.ShowDialog(new()
    {
        Icon = TaskDialogIcon.Error,
        Caption = $"Oops! {Application.ProductName} is encountering an error.",

        Heading = ex.Message,
        Text = "Unhandled exception has occurred." +
                "\r\nYou can click Continue to ignore this error, Copy to copy the error details, or Quit to exit the application.",
        Expander = new(ex.ToString()),
        Buttons = new TaskDialogButtonCollection
        {
            new TaskDialogButton("Continue", allowCloseDialog: true),
            new TaskDialogButton("Copy", allowCloseDialog: false),
            new TaskDialogButton("Quit", allowCloseDialog: true),
        },
    });
}

