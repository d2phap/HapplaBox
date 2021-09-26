
using System.Threading;
using System.Windows.Forms;
using HapplaBox;
using HapplaBox.Settings;

ApplicationConfiguration.Initialize();
Application.SetHighDpiMode(HighDpiMode.PerMonitorV2);

Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
Application.ThreadException += Application_ThreadException;

void Application_ThreadException(object sender, ThreadExceptionEventArgs e)
{
    TaskDialog.ShowDialog(new()
    {
        Icon = TaskDialogIcon.Error,
        Caption = $"Oops! {Application.ProductName} is encountering an error.",

        Heading = e.Exception.Message,
        Text = "Unhandled exception has occurred." +
                "\r\nYou can click Continue to ignore this error, Copy to copy the error details, or Quit to exit the application.",
        Expander = new(e.Exception.ToString()),
        Buttons = new TaskDialogButtonCollection
        {
            new TaskDialogButton("Continue", allowCloseDialog: true),
            new TaskDialogButton("Copy", allowCloseDialog: false),
            new TaskDialogButton("Quit", allowCloseDialog: true),
        },
    });
}


// load application configs
Config.Load();

Application.Run(new FrmMain());
