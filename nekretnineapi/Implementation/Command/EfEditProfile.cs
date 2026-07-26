using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;

namespace Implementation.Command
{
    public class EfEditProfile : IEditProfile
    {
        public int Id => 13;
        public string Name => "Edit Profile";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfEditProfile(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(EditProfileDTO request)
        {
            var basic = db.UserBasics
                .FirstOrDefault(b => b.FkId == actor.Id)
                ?? throw new KeyNotFoundException("User details not found.");

            basic.FirstName = request.FirstName;
            basic.LastName = request.LastName;

            db.SaveChanges();
        }
    }
}
