using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;

namespace Implementation.Command
{
    public class EfToggleWishlist : IToggleWishlist
    {
        public int Id => 14;
        public string Name => "Toggle Wishlist";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfToggleWishlist(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(WishlistToggleDTO request)
        {
            var existing = db.Wishlists
                .FirstOrDefault(w => w.UserId == actor.Id && w.RealestateId == request.RealestateId);

            if (existing != null)
            {
                db.Wishlists.Remove(existing);
            }
            else
            {
                var exists = db.Realestates.Any(r => r.Id == request.RealestateId && r.IsActive == 1);
                if (!exists)
                    throw new KeyNotFoundException("Listing not found.");

                db.Wishlists.Add(new Wishlist
                {
                    UserId = actor.Id,
                    RealestateId = request.RealestateId,
                    IsActive = new byte[] { 0x01 }
                });
            }

            db.SaveChanges();
        }
    }
}
