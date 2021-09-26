using HapplaBox.UI.WinApi;
using System;
using System.Drawing;

namespace HapplaBox.UI
{
    public class Theme
    {
        /// <summary>
        /// Theme API version, to check compatibility
        /// </summary>
        public string CONFIG_VERSION { get; } = "8";

        /// <summary>
        /// Filename of theme configuration since v8.0
        /// </summary>
        public static string CONFIG_FILE { get; } = "igtheme.xml";



        #region PUBLIC PROPERTIES
        public Color AccentColor { get; private set; }

        public Color BackgroundColor { get; private set; }
        public Color BackgroundInactiveColor { get; private set; }

        #endregion


        public Theme()
        {
            this.Update();
        }

        public void Update()
        {
            this.AccentColor = WinColors.AccentBrush;

            this.BackgroundColor = Color.FromArgb(255, 235, 246, 249);
            this.BackgroundInactiveColor = Color.FromArgb(255, 243, 243, 243);
        }


        
    }
}
