using System;
using System.Text.RegularExpressions;
using Insomnia.Core.Models;
using Newtonsoft.Json;

namespace Insomnia.Core.Util
{
    public class ClassEnumJsonConverter : JsonConverter<ClassEnum>
    {
        public override ClassEnum ReadJson(JsonReader reader, Type objectType, ClassEnum existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            var token = reader.Value as string ?? reader.Value.ToString();
            var stripped = Regex.Replace(token, @"<[^>]+>", string.Empty);
            return Enum.TryParse<ClassEnum>(stripped, out var result) ? result : default;
        }

        public override void WriteJson(JsonWriter writer, ClassEnum value, JsonSerializer serializer)
        {
            writer.WriteValue(value.ToString());
        }
    }
}

