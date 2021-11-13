
using HapplaBox.Base;
using System.Text;

namespace HapplaBox
{
    internal class ViewStatusModel
    {
        public int? Index { get; set; }
        public float? ZoomFactor { get; set; }

        public string? Web2Version { get; set; }

        public int? Width { get; set; }
        public int? Height { get; set; }
    }


    internal class ViewStatus
    {
        public ViewStatusModel Data { get; set; } = new();


        /// <summary>
        /// Updates status data by parsing json
        /// </summary>
        /// <param name="json"></param>
        public void Update(string? json)
        {
            var newData = Helpers.ParseJson<ViewStatusModel>(json ?? "{}");

            if (newData?.Index != null)
            {
                Data.Index = newData.Index;
            }

            if (newData?.ZoomFactor != null)
            {
                Data.ZoomFactor = newData.ZoomFactor;
            }

            if (newData?.Web2Version != null)
            {
                Data.Web2Version = newData.Web2Version;
            }

            if (newData?.Width != null)
            {
                Data.Width = newData.Width;
            }

            if (newData?.Height != null)
            {
                Data.Height = newData.Height;
            }
        }


        /// <summary>
        /// Convert status data to string
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            if (Local.ImgSvc == null) return "";

            var currentIndex = Data.Index ?? -1;
            var listCount = Local.ImgSvc.Length;
            var filename = Local.ImgSvc.GetFileName(currentIndex);
            var zoomFactor = Math.Round((Data.ZoomFactor ?? 1.0f) * 100, 2);
            //var dimmension = $"{Data.Width} x {Data.Height}";

            var str = new StringBuilder();
            str.AppendJoin("  |  ",
                Application.ProductName + $" [{Data.Web2Version}]",
                $"{currentIndex + 1}/{listCount}",
                filename,
                $"{zoomFactor}%");

            return str.ToString();
        }
    }
}
