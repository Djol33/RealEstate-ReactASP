using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.Results;

namespace Implementation.Command
{
    public class EfSubmitContactMessage : ISubmitContactMessage
    {
        public int Id => 49;
        public string Name => "Submit Contact Message";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfSubmitContactMessage(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(SubmitContactMessageDTO request)
        {
            var isLoggedIn = actor.Id > 0;

            var failures = new List<ValidationFailure>();

            if (!db.ContactReasons.Any(r => r.Id == request.ReasonId))
                failures.Add(new("reasonId", "Please select a valid reason."));

            var message = (request.Message ?? "").Trim();
            if (string.IsNullOrWhiteSpace(message))
                failures.Add(new("message", "Message cannot be empty."));
            else if (message.Length < 10)
                failures.Add(new("message", "Message must be at least 10 characters."));
            else if (message.Length > 2000)
                failures.Add(new("message", "Message cannot exceed 2000 characters."));

            string firstName, lastName, email;

            if (isLoggedIn)
            {
                var user = db.Users.FirstOrDefault(u => u.Id == actor.Id)
                    ?? throw new KeyNotFoundException("User not found.");

                var basic = db.UserBasics.FirstOrDefault(b => b.FkId == user.Id);
                firstName = basic?.FirstName ?? "";
                lastName = basic?.LastName ?? "";
                email = user.Email;
            }
            else
            {
                firstName = (request.FirstName ?? "").Trim();
                lastName = (request.LastName ?? "").Trim();
                email = (request.Email ?? "").Trim();

                if (string.IsNullOrWhiteSpace(firstName))
                    failures.Add(new("firstName", "First name cannot be empty."));
                if (string.IsNullOrWhiteSpace(lastName))
                    failures.Add(new("lastName", "Last name cannot be empty."));
                if (string.IsNullOrWhiteSpace(email) || !System.Text.RegularExpressions.Regex.IsMatch(email, @"^[^\s@]+@[^\s@]+\.[^\s@]+$"))
                    failures.Add(new("email", "Please enter a valid email address."));
            }

            if (failures.Count > 0)
                throw new ValidationException(failures);

            db.Supports.Add(new Support
            {
                IdUser = isLoggedIn ? actor.Id : null,
                FName = firstName,
                LName = lastName,
                Email = email,
                Title = "Contact form",
                Content = message,
                DateReported = DateTime.Now,
                IsRead = 0,
                ReasonId = request.ReasonId
            });

            db.SaveChanges();
        }
    }
}
