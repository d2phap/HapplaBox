using HapplaBox.Core;
using HapplaBox.Core.Services;

namespace HapplaBox
{
    internal class Local
    {
        /// <summary>
        /// Gets, sets current image list
        /// </summary>
        public static ImageService ImgSvc { get; set; }


        /// <summary>
        /// Gets, sets gallery
        /// </summary>
        public static GalleryService GallerySvc { get; set; }

    }
}
