using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Implementation.Command
{
    public class EfEditRealEstate : IEditRealestate
    {
        public int Id => 12;
        public string Name => "Edit Real Estate";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfEditRealEstate(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(EditRealestateDTO request)
        {
            var realestate = db.Realestates
                .Include(r => r.Amenities)
                .FirstOrDefault(r => r.Id == request.Id)
                ?? throw new KeyNotFoundException("Listing not found.");

           
            bool isOwner = realestate.Owner == actor.Id;

            if (  !isOwner)
                throw new UnauthorizedAccessException("You do not have permission to edit this listing.");

            realestate.Title = request.Title;
            realestate.Description = request.Description;
            realestate.Price = request.Price;
            realestate.City = request.CityId;
            realestate.TypeObject = (short)request.TypeObjectId;
            realestate.Terrace = request.Terrace;
            realestate.Registered = request.Registered;
            realestate.Area = request.Area;
            realestate.Adress = request.Address;
            realestate.NumberOfRooms = request.NumberOfRooms;

            // brisi slike koje korisnik nije zadrzao
            var toDelete = db.RealestateImages
                .Where(i => i.IdPost == realestate.Id && !request.ExistingImageIds.Contains(i.Id))
                .ToList();
            db.RealestateImages.RemoveRange(toDelete);

            // dodaj nove slike
            foreach (var path in request.ImagePaths)
            {
                realestate.RealestateImages.Add(new RealestateImage
                {
                    Location = path,
                    Alt = Path.GetFileName(path)
                });
            }

            var selectedAmenities = db.Amenities.Where(a => request.AmenityIds.Contains(a.Id)).ToList();
            realestate.Amenities.Clear();
            foreach (var amenity in selectedAmenities)
                realestate.Amenities.Add(amenity);

            db.SaveChanges();
        }
    }
}
