
namespace HapplaBox.Base
{
    /// <summary>
    /// Modal object for parsing message from webview client
    /// </summary>
    /// <typeparam name="T">Web message data type</typeparam>
    public class WebMessageModel<T>
    {
        /// <summary>
        /// Event name
        /// </summary>
        public WebMessageName Name { get; set; } = WebMessageName.Unknown;

        /// <summary>
        /// Message data
        /// </summary>
        public T? Data { get; set; }
    }
}
