using Application;
using Application.Command.Admin;
using DataDomain.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Implementation.Command.Admin
{
    public class EfDeleteContactReason : IDeleteContactReason
    {
        public int Id => 48;
        public string Name => "Delete Contact Reason";

        private readonly AppDbContext db;

        public EfDeleteContactReason(AppDbContext db)
        {
            this.db = db;
        }

        public void Execute(int request)
        {

            var reason = db.ContactReasons.FirstOrDefault(r => r.Id == request)
                ?? throw new KeyNotFoundException("Reason not found.");

            if (!reason.IsActive)
                return;

            reason.IsActive = false;
            db.SaveChanges();
        }
    }
}
