using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;

namespace Implementation.Command.Admin
{
    public class EfAdminEditUser : IAdminEditUser
    {
        public int Id => 29;
        public string Name => "Admin Edit User";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfAdminEditUser(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(AdminEditUserDTO request)
        {
            if (actor.UserRole != UserRoles.Admin)
                throw new UnauthorizedAccessException("Only an administrator can edit users.");

            var user = db.Users
                .FirstOrDefault(u => u.Id == request.UserId)
                ?? throw new KeyNotFoundException("User not found.");

            var email = (request.Email ?? "").Trim();
            var firstName = (request.FirstName ?? "").Trim();
            var lastName = (request.LastName ?? "").Trim();

            var failures = new List<FluentValidation.Results.ValidationFailure>();
            if (string.IsNullOrWhiteSpace(email))
                failures.Add(new("email", "Email cannot be empty."));
            if (string.IsNullOrWhiteSpace(firstName))
                failures.Add(new("firstName", "First name cannot be empty."));
            if (string.IsNullOrWhiteSpace(lastName))
                failures.Add(new("lastName", "Last name cannot be empty."));
            if (failures.Count > 0)
                throw new ValidationException(failures);

            if (db.Users.Any(u => u.Email == email && u.Id != user.Id))
                throw new ValidationException("Another user already uses this email.");

            if (user.Id == actor.Id && !request.IsActive)
                throw new UnauthorizedAccessException("You cannot deactivate your own account.");

            user.Email = email;
            user.IsActive = (short)(request.IsActive ? 1 : 0);

            var basic = db.UserBasics.FirstOrDefault(b => b.FkId == user.Id);
            if (basic == null)
            {
                basic = new UserBasic { FkId = user.Id, FirstName = firstName, LastName = lastName };
                db.UserBasics.Add(basic);
            }
            else
            {
                basic.FirstName = firstName;
                basic.LastName = lastName;
            }

            db.SaveChanges();
        }
    }
}
