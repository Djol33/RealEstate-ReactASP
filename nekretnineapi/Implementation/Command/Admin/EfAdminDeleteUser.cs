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

            // oglasi korisnika + zavisni podaci
            var realestates = db.Realestates.Where(r => r.Owner == userId).Select(r => r.Id).ToList();
            if (realestates.Count > 0)
            {
                var images = db.RealestateImages.Where(i => realestates.Contains(i.IdPost));
                db.RealestateImages.RemoveRange(images);

                var wishOnMine = db.Wishlists.Where(w => realestates.Contains(w.RealestateId));
                db.Wishlists.RemoveRange(wishOnMine);

                db.Realestates.RemoveRange(db.Realestates.Where(r => r.Owner == userId));
            }

            // wishlist zapisi korisnika
            db.Wishlists.RemoveRange(db.Wishlists.Where(w => w.UserId == userId));

            // poruke korisnika (u oba smera)
            db.Messages.RemoveRange(db.Messages.Where(m => m.SenderId == userId || m.ReceiverId == userId));

            // view zapisi korisnika
            db.RealestateViews.RemoveRange(db.RealestateViews.Where(v => v.ViewerKey == "u:" + userId));

            // profil (user_basic) + user
            db.UserBasics.RemoveRange(db.UserBasics.Where(b => b.FkId == userId));
            db.Users.Remove(user);

            db.SaveChanges();
        }
    }
}
