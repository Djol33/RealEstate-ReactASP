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
        private readonly IApplicationActor actor;

        public EfDeleteAmenity(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(int request)
        {
            if (actor.UserRole != UserRoles.Admin)
                throw new UnauthorizedAccessException("Only an administrator can manage amenities.");

            var amenity = db.Amenities.FirstOrDefault(a => a.Id == request)
                ?? throw new KeyNotFoundException("Amenity not found.");

            db.Amenities.Remove(amenity);
            db.SaveChanges();
        }
    }
}
