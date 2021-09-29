using HapplaBox.Core.Codec;
using System;
using System.Collections.Generic;
using System.Drawing;

namespace HapplaBox.Codec.Web
{
    public class Codec : ICodec
    {
        public string Name => "HapplaBox Web codec";
        public string Description => "Use web platform to decode image formats.";
        public string Author => "Duong Dieu Phap";
        public string Contact => "phap@imageglass.org";
        public Version Version => new(1, 0, 0, 0);

        public Version ApiVersion => new(0, 5);

        public List<string> SupportedExts => new(5)
        {
            ".apng",
            ".avif",
            ".gif",
            ".jpg,", ".jpeg,", ".jfif,", ".pjpeg,", ".pjp",
            ".png",
            ".svg",
            ".webp",
            ".bmp",
            ".ico", ".cur",
        };


        public Bitmap Load(string filename, CodecReadSettings settings)
        {
            throw new NotImplementedException();
        }
    }
}
