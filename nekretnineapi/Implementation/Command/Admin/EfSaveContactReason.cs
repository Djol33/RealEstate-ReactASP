using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.Results;

namespace Implementation.Command.Admin
{
    public class EfSaveContactReason : ISaveContactReason
    {
        public int Id => 47;
        public string Name => "Save Contact Reason";

        private readonly AppDbContext db;

        public EfSaveContactReason(AppDbContext db)
        {
            this.db = db;
        }

        public void Execute(SaveContactReasonDTO request)
        {

            var name = request.Name ?? "";


            if (request.Id > 0)
            {
                var reason = db.ContactReasons.FirstOrDefault(r => r.Id == request.Id)
                    ?? throw new KeyNotFoundException("Reason not found.");

                reason.Name = name;
            }
            else
            {
                db.ContactReasons.Add(new ContactReason
                {
                    Name = name,
                    CreatedAt = DateTime.Now
                });
            }

            db.SaveChanges();
        }
    }
}
