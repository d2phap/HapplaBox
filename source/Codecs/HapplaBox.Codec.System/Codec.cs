using HapplaBox.Core.Codec;
using System.Drawing.Imaging;

namespace HapplaBox.Codec.System
{
    public class Codec : ICodec
    {
        public string Name => "System codec";

        public string Description => "Use default system codec to decode file formats";

        public string Author => "Duong Dieu Phap";
        public string Contact => "phap@imageglass.org";
        public Version Version => new(1, 0, 0, 0);

        public Version ApiVersion => new(0, 5);

        public List<string> SupportedExts => new(2)
        {
            ".jpg",
            ".png",
        };

        public byte[] GetThumbnail(string filename, int width, int height)
        {
            using var bmp = new Bitmap(filename);
            using var thumb = bmp.GetThumbnailImage(width, height, null, IntPtr.Zero);

            using var ms = new MemoryStream();
            thumb.Save(ms, ImageFormat.Png);

            return ms.ToArray();
        }

        public string GetThumbnailBase64(string filename, int width, int height)
        {
            var bytes = GetThumbnail(filename, width, height);

            return "data:image/png;base64," + Convert.ToBase64String(bytes);
        }

        public Bitmap Load(string filename, CodecReadSettings settings)
        {
            return new Bitmap(filename);
        }
    }
}