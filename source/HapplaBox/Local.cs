using HapplaBox.Core;
using HapplaBox.Core.Services;

namespace HapplaBox
{
    internal class Local
    {
        /// <summary>
        /// Gets, sets current image list
        /// </summary>
        public static ImgFactory ImgList { get; set; }

        public static GalleryService GallerySvc { get; set; }

    }
}
