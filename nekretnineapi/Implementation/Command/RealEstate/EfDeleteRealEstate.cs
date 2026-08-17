using Application;
using Application.Command;
using DataDomain.Entities;

namespace Implementation.Command
{
    public class EfDeleteRealEstate : IDeleteRealestate
    {
        public int Id => 15;
        public string Name => "Delete Real Estate";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfDeleteRealEstate(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(long request)
        {
            var realestate = db.Realestates
                .FirstOrDefault(r => r.Id == request)
                ?? throw new KeyNotFoundException("Listing not found.");

            bool isOwner = realestate.Owner == actor.Id;
            bool isAdmin = actor.UserRole == UserRoles.Admin;

            if (!isOwner && !isAdmin)
                throw new UnauthorizedAccessException("You do not have permission to delete this listing.");

            if (realestate.IsActive != 1)
                return;

            var wishlists = db.Wishlists.Where(w => w.RealestateId == realestate.Id).ToList();
            db.Wishlists.RemoveRange(wishlists);

            realestate.IsActive = 0;
            db.SaveChanges();
        }
    }
}
