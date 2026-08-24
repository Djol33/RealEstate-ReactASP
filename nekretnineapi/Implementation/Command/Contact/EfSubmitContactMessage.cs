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

            var message = request.Message ?? "";

            string firstName, lastName, email;

            if (isLoggedIn)
            {
                var user = db.Users.FirstOrDefault(u => u.Id == actor.Id)
                    ?? throw new KeyNotFoundException("User not found.");

                var basic = db.UserBasics.FirstOrDefault(b => b.FkId == user.Id);
                if (basic != null)
                {
                    firstName = basic.FirstName ?? "";
                    lastName = basic.LastName ?? "";
                }
                else
                {
                    var company = db.Companies.FirstOrDefault(c => c.FkId == user.Id);
                    firstName = company?.Name ?? "";
                    lastName = "";
                }
                email = user.Email;
            }
            else
            {
                firstName = request.FirstName ?? "";
                lastName = request.LastName ?? "";
                email = request.Email ?? "";
            }

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
