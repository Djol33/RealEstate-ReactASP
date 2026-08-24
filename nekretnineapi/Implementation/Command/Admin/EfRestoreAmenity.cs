using Application;
using Application.Command.Admin;
using DataDomain.Entities;

namespace Implementation.Command.Admin
{
    public class EfRestoreAmenity : IRestoreAmenity
    {
        public int Id => 54;
        public string Name => "Restore Amenity";

        private readonly AppDbContext db;

        public EfRestoreAmenity(AppDbContext db)
        {
            this.db = db;
        }

        public void Execute(int request)
        {

            var amenity = db.Amenities.FirstOrDefault(a => a.Id == request)
                ?? throw new KeyNotFoundException("Amenity not found.");

            amenity.IsActive = true;
            db.SaveChanges();
        }
    }
}
