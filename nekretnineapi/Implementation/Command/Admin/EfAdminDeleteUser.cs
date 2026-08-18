using Application;
using Application.Command.Admin;
using DataDomain.Entities;

namespace Implementation.Command.Admin
{
    public class EfAdminDeleteUser : IAdminDeleteUser
    {
        public int Id => 25;
        public string Name => "Admin Delete User";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfAdminDeleteUser(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(int userId)
        {
            if (actor.UserRole != UserRoles.Admin)
                throw new UnauthorizedAccessException("Only an administrator can delete users.");

            if (userId == actor.Id)
                throw new UnauthorizedAccessException("You cannot delete your own account.");

            var user = db.Users
                .FirstOrDefault(u => u.Id == userId)
                ?? throw new KeyNotFoundException("User not found.");

            if (user.IsActive != 1)
                return;

            var listings = db.Realestates.Where(r => r.Owner == userId && r.IsActive == 1).ToList();
            foreach (var listing in listings)
                listing.IsActive = 0;

            var listingIds = listings.Select(r => r.Id).ToList();
            if (listingIds.Count > 0)
                db.Wishlists.RemoveRange(db.Wishlists.Where(w => listingIds.Contains(w.RealestateId)));

            db.Wishlists.RemoveRange(db.Wishlists.Where(w => w.UserId == userId));

            user.IsActive = 0;

            db.SaveChanges();
        }
    }
}
