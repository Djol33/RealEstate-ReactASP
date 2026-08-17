using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;

namespace Implementation.Command
{
    public class EfAddRealEstate : IAddRealestate
    {
        public int Id => 11;
        public string Name => "Add Real Estate";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfAddRealEstate(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
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
                Registered = request.Registered,
                Area = request.Area,
                Adress = request.Address,
                NumberOfRooms = request.NumberOfRooms,
                IsActive = 1,
                Owner = actor.Id,
                Lat = request.Lat,
                Lng = request.Lng,
                Status = request.Status
            };

            foreach (var path in request.ImagePaths)
            {
                realestate.RealestateImages.Add(new RealestateImage
                {
                    Location = path,
                    Alt = Path.GetFileName(path)
                });
            }

            if (request.AmenityIds.Count > 0)
            {
                var amenities = db.Amenities.Where(a => request.AmenityIds.Contains(a.Id)).ToList();
                foreach (var amenity in amenities)
                    realestate.Amenities.Add(amenity);
            }

            db.Realestates.Add(realestate);
            db.SaveChanges();
        }
    }
}
