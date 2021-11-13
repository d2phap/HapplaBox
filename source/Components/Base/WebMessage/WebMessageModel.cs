
namespace HapplaBox.Base
{
    /// <summary>
    /// Modal object for parsing message from webview client
    /// </summary>
    /// <typeparam name="T">Web message data type</typeparam>
    public class WebMessageModel<T>
    {
        /// <summary>
        /// Event code
        /// </summary>
        public string Code { get; set; }


        /// <summary>
        /// Message data
        /// </summary>
        public T? Data { get; set; }


        public WebMessageModel(string code, T? data)
        {
            Code = code;
            Data = data;
        }
    }


    public class WebUiPoint
    {
        public int X { get; set; } = 0;
        public int Y { get; set; } = 0;
    }
}
