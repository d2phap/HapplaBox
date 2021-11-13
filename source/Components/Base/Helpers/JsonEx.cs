using System.Text.Json;

namespace HapplaBox.Base
{
    public partial class Helpers
    {
        /// <summary>
        /// Parse JSON string to object
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json"></param>
        /// <returns></returns>
        public static T? ParseJson<T>(string json)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };


            var result = JsonSerializer.Deserialize<T>(json, options);

            return result;
        }
    }
}
