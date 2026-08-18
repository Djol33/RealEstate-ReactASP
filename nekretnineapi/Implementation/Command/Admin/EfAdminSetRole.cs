using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using DataDomain.Entities;

namespace Implementation.Command.Admin
{
    public class EfAdminSetRole : IAdminSetRole
    {
        public int Id => 26;
        public string Name => "Admin Set Role";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfAdminSetRole(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(SetRoleDTO request)
        {
            if (actor.UserRole != UserRoles.Admin)
                throw new UnauthorizedAccessException("Only an administrator can change roles.");

            if (request.UserId == actor.Id && request.Role != UserRoles.Admin)
                throw new UnauthorizedAccessException("You cannot remove your own admin role.");

            var user = db.Users
                .FirstOrDefault(u => u.Id == request.UserId)
                ?? throw new KeyNotFoundException("User not found.");

            user.UserRole = request.Role;
            db.SaveChanges();
        }
    }
}
