using Application;
using Application.Command.Admin;
using DataDomain.Entities;

namespace Implementation.Command.Admin
{
    public class EfDeleteAmenity : IDeleteAmenity
    {
        public int Id => 45;
        public string Name => "Delete Amenity";

        private readonly AppDbContext db;

        public EfDeleteAmenity(AppDbContext db)
        {
            this.db = db;
        }

        public void Execute(int request)
        {

            var amenity = db.Amenities.FirstOrDefault(a => a.Id == request)
                ?? throw new KeyNotFoundException("Amenity not found.");

            amenity.IsActive = false;
            db.SaveChanges();
        }
    }
}
