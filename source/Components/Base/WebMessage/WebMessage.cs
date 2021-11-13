
using System.Text.Json;

namespace HapplaBox.Base
{
    public static class WebMessage
    {
        /// <summary>
        /// Parse web message object to JSON string
        /// </summary>
        /// <param name="name">Web message name</param>
        /// <param name="data">Web message data</param>
        /// <returns></returns>
        public static string ToJson<T>(string code, T data)
        {
            var model = new WebMessageModel<T>(code, data);
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
            };

            return JsonSerializer.Serialize(model, options);
        }


        /// <summary>
        /// Parse JSON string to WebMessageModel object with case insensitive
        /// </summary>
        /// <typeparam name="T">Type of the message data</typeparam>
        /// <param name="json">JSON string</param>
        /// <returns></returns>
        public static WebMessageModel<T>? FromJson<T>(string json)
        {
            return Helpers.ParseJson<WebMessageModel<T>>(json);
        }
    }
}
