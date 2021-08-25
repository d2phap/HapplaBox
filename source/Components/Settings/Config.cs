using HapplaBox.Base;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Text.Json;


namespace HapplaBox.Settings
{
    /// <summary>
    /// Provides app configuration
    /// </summary>
    public class Config
    {

        #region Internal properties
        private static readonly Source _source = new();


        #endregion




        #region HapplaBox settings

        /// <summary>
        /// Gets, sets 'Left' position of WinMain
        /// </summary>
        public static int WinMainPositionX { get; set; } = 200;

        /// <summary>
        /// Gets, sets 'Top' position of WinMain
        /// </summary>
        public static int WinMainPositionY { get; set; } = 200;

        /// <summary>
        /// Gets, sets width of WinMain
        /// </summary>
        public static int WinMainWidth { get; set; } = 1200;

        /// <summary>
        /// Gets, sets height of WinMain
        /// </summary>
        public static int WinMainHeight { get; set; } = 800;

        /// <summary>
        /// Gets, sets window state of WinMain
        /// </summary>
        public static WindowState WinMainState { get; set; } = WindowState.Normal;

        /// <summary>
        /// Gets, sets window top most state
        /// </summary>
        public static bool IsAlwaysOnTop { get; set; } = false;

        /// <summary>
        /// Gets, sets window Full screen mode
        /// </summary>
        public static bool IsFullScreen { get; set; } = false;


        #endregion


        #region Public functions

        /// <summary>
        /// Loads and parsse configs from file
        /// </summary>
        public static void Load()
        {
            var items = _source.LoadUserConfigs();


            // Number values
            WinMainPositionX = items.GetValue(nameof(WinMainPositionX), WinMainPositionX);
            WinMainPositionY = items.GetValue(nameof(WinMainPositionY), WinMainPositionY);
            WinMainWidth = items.GetValue(nameof(WinMainWidth), WinMainWidth);
            WinMainHeight = items.GetValue(nameof(WinMainHeight), WinMainHeight);

            // Boolean values
            IsAlwaysOnTop = items.GetValue(nameof(IsAlwaysOnTop), IsAlwaysOnTop);
            IsFullScreen = items.GetValue(nameof(IsFullScreen), IsFullScreen);


            // Enum value
            WinMainState = items.GetValue(nameof(WinMainState), WinMainState);
        }


        /// <summary>
        /// Parses and writes configs to file
        /// </summary>
        public static void Write()
        {
            var jsonFile = MyApp.ConfigDir(PathType.File, Source.UserFilename);
            using var fs = File.Create(jsonFile);
            using var writter = new Utf8JsonWriter(fs, new JsonWriterOptions()
            {
                Indented = true
            });


            JsonSerializer.Serialize(writter, GetSettingObjects());
        }

        #endregion


        #region Private functions

        /// <summary>
        /// Converts all settings to ExpandoObject for Json parsing
        /// </summary>
        /// <returns></returns>
        private static dynamic GetSettingObjects()
        {
            var settings = new ExpandoObject();

            var infoJson = new
            {
                _source.Description,
                _source.Version
            };

            settings.TryAdd("Info", infoJson);


            // Number values
            settings.TryAdd(nameof(WinMainPositionX), WinMainPositionX);
            settings.TryAdd(nameof(WinMainPositionY), WinMainPositionY);
            settings.TryAdd(nameof(WinMainWidth), WinMainWidth);
            settings.TryAdd(nameof(WinMainHeight), WinMainHeight);

            // Enum values
            settings.TryAdd(nameof(WinMainState), WinMainState.ToString());

            // Boolean values
            settings.TryAdd(nameof(IsAlwaysOnTop), IsAlwaysOnTop.ToString());
            settings.TryAdd(nameof(IsFullScreen), IsFullScreen.ToString());


            return settings;
        }

        #endregion


    }
}

