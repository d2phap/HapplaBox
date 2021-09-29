using System;
using System.Collections.Generic;
using System.Drawing;


namespace HapplaBox.Core.Codec
{

    /// <summary>
    /// Settings for loading image
    /// </summary>
    public struct CodecReadSettings
    {
        public int Width;
        public int Height;
        public bool IgnoreColorProfile;
    }


    /// <summary>
    /// Provides interface of image codec
    /// </summary>
    public interface ICodec
    {
        /// <summary>
        /// Full name of assembly type of this codec
        /// </summary>
        public string CodecId => this.GetType().FullName ?? string.Empty;

        /// <summary>
        /// Name of the codec
        /// </summary>
        public string Name { get; }

        /// <summary>
        /// Short description of the codec
        /// </summary>
        public string Description { get; }

        /// <summary>
        /// Author of the codec
        /// </summary>
        public string Author { get; }

        /// <summary>
        /// Get the supported extensions
        /// </summary>
        public List<string> SupportedExts { get; }

        /// <summary>
        /// Contact info of the codec author
        /// </summary>
        public string Contact { get; }


        /// <summary>
        /// Version of the codec
        /// </summary>
        public Version Version { get; }


        /// <summary>
        /// Version of the API used in writting the codec
        /// </summary>
        public Version ApiVersion { get; }


        /// <summary>
        /// Loads image file and returns BitmapSource
        /// </summary>
        /// <param name="filename">Full path of the file</param>
        /// <param name="settings">Loading settings</param>
        /// <returns></returns>
        public Bitmap Load(string filename, CodecReadSettings settings);
    }
}
