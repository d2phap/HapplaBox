
using System.Windows.Forms;
using HapplaBox;
using HapplaBox.Settings;

ApplicationConfiguration.Initialize();
Application.SetHighDpiMode(HighDpiMode.PerMonitorV2);

// load application configs
Config.Load();

Application.Run(new FrmMain());
