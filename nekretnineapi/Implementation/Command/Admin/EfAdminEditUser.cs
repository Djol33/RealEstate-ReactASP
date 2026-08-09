using System.Text.RegularExpressions;
using Application;
using Application.Command;
using Application.Command.Admin;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.Results;

namespace Implementation.Command.Admin
{
    public class EfAdminEditUser : IAdminEditUser
    {
        public int Id => 29;
        public string Name => "Admin Edit User";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;
        private readonly ISendSystemMessage sendSystemMessage;

        public EfAdminEditUser(AppDbContext db, IApplicationActor actor, ISendSystemMessage sendSystemMessage)
        {
            this.db = db;
            this.actor = actor;
            this.sendSystemMessage = sendSystemMessage;
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

            var failures = new List<ValidationFailure>();
            if (string.IsNullOrWhiteSpace(email))
                failures.Add(new("email", "Email cannot be empty."));
            else if (!Regex.IsMatch(email, @"^[^\s@]+@[^\s@]+\.[^\s@]+$"))
                failures.Add(new("email", "Please enter a valid email address."));

            if (string.IsNullOrWhiteSpace(firstName))
                failures.Add(new("firstName", "First name cannot be empty."));
            else if (firstName.Length < 3)
                failures.Add(new("firstName", "First name must be at least 3 characters."));

            if (string.IsNullOrWhiteSpace(lastName))
                failures.Add(new("lastName", "Last name cannot be empty."));
            else if (lastName.Length < 3)
                failures.Add(new("lastName", "Last name must be at least 3 characters."));

            if (failures.Count == 0 && db.Users.Any(u => u.Email == email && u.Id != user.Id))
                failures.Add(new("email", "Another user already uses this email."));

            if (failures.Count > 0)
                throw new ValidationException(failures);

            if (user.Id == actor.Id && !request.IsActive)
                throw new UnauthorizedAccessException("You cannot deactivate your own account.");

            var wasActive = user.IsActive == 1;

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

            if (wasActive && !request.IsActive)
            {
                sendSystemMessage.Execute(new SendSystemMessageDTO
                {
                    ReceiverId = user.Id,
                    Content = "Your account has been deactivated by an administrator. Contact support if you believe this is a mistake."
                });
            }
            else if (!wasActive && request.IsActive)
            {
                sendSystemMessage.Execute(new SendSystemMessageDTO
                {
                    ReceiverId = user.Id,
                    Content = "Your account has been reactivated. Welcome back!"
                });
            }
        }
    }
}
