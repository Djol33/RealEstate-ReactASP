using System.Text.Json;

namespace nekretnineapi.Services
{
    public class GeocodingService
    {
        private readonly IHttpClientFactory httpClientFactory;

        public GeocodingService(IHttpClientFactory httpClientFactory)
        {
            this.httpClientFactory = httpClientFactory;
        }

        public async Task<(decimal lat, decimal lng)?> GetCoordinates(string address)
        {
            try
            {
                var client = httpClientFactory.CreateClient("nominatim");
                var url = $"/search?q={Uri.EscapeDataString(address)}&format=json&limit=1";
                var response = await client.GetAsync(url);

                if (!response.IsSuccessStatusCode) return null;

                var json = await response.Content.ReadAsStringAsync();
                var results = JsonSerializer.Deserialize<JsonElement>(json);

                if (results.GetArrayLength() == 0) return null;

                var first = results[0];
                var lat = decimal.Parse(first.GetProperty("lat").GetString()!, System.Globalization.CultureInfo.InvariantCulture);
                var lng = decimal.Parse(first.GetProperty("lon").GetString()!, System.Globalization.CultureInfo.InvariantCulture);

                return (lat, lng);
            }
            catch
            {
                return null;
            }
        }
    }
}
