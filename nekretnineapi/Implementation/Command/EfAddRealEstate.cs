using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;
using System.Text.Json;

namespace Implementation.Command
{
    public class EfAddRealEstate : IAddRealestate
    {
        public int Id => 11;
        public string Name => "Add Real Estate";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;
        private readonly IHttpClientFactory httpClientFactory;

        public EfAddRealEstate(AppDbContext db, IApplicationActor actor, IHttpClientFactory httpClientFactory)
        {
            this.db = db;
            this.actor = actor;
            this.httpClientFactory = httpClientFactory;
        }

        public void Execute(AddRealestateDTO request)
        {
            var realestate = new Realestate
            {
                Title = request.Title,
                Description = request.Description,
                Price = request.Price,
                City = request.CityId,
                TypeObject = (short)request.TypeObjectId,
                Terrace = request.Terrace,
                Area = request.Area,
                Adress = request.Address,
                NumberOfRooms = request.NumberOfRooms,
                IsActive = 1,
                Owner = actor.Id
            };

            var cityName = db.Cities.Where(c => c.Id == request.CityId).Select(c => c.City1).FirstOrDefault() ?? string.Empty;
            var fullAddress = $"{request.Address}, {cityName}";
            var coords = GetCoordinates(fullAddress).GetAwaiter().GetResult();
            if (coords.HasValue)
            {
                realestate.Lat = coords.Value.lat;
                realestate.Lng = coords.Value.lng;
            }

            foreach (var path in request.ImagePaths)
            {
                realestate.RealestateImages.Add(new RealestateImage
                {
                    Location = path,
                    Alt = Path.GetFileName(path)
                });
            }

            db.Realestates.Add(realestate);
            db.SaveChanges();
        }

        private async Task<(decimal lat, decimal lng)?> GetCoordinates(string address)
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
