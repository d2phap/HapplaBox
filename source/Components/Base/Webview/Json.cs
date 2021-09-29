
using System.Text.Json;

namespace HapplaBox.Base
{
    public static class Json
    {
        /// <summary>
        /// Parse JSON string to WebMessageModel object with case insensitive
        /// </summary>
        /// <typeparam name="T">Type of the message data</typeparam>
        /// <param name="json">JSON string</param>
        /// <returns></returns>
        public static WebMessageModel<T>? Parse<T>(string json)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };


            var result = JsonSerializer.Deserialize<WebMessageModel<T>>(json, options);

            return result;
        }
    }
}
