using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.Results;

namespace Implementation.Command
{
    public class EfEditCompany : IEditCompany
    {
        public int Id => 28;
        public string Name => "Edit Company";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfEditCompany(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(EditCompanyDTO request)
        {
            var company = db.Companies
                .FirstOrDefault(c => c.FkId == actor.Id)
                ?? throw new KeyNotFoundException("Company details not found.");

            var name = (request.Name ?? "").Trim();
            var bip = (request.BIP ?? "").Trim();

            var failures = new List<ValidationFailure>();
            if (string.IsNullOrWhiteSpace(name))
                failures.Add(new("name", "Company name cannot be empty."));
            else if (name.Length > 50)
                failures.Add(new("name", "Company name cannot exceed 50 characters."));

            if (string.IsNullOrWhiteSpace(bip))
                failures.Add(new("bip", "Tax ID cannot be empty."));
            else if (bip.Length > 40)
                failures.Add(new("bip", "Tax ID cannot exceed 40 characters."));
            else if (db.Companies.Any(c => c.Bip == bip && c.Id != company.Id))
                failures.Add(new("bip", "This Tax ID is already in use."));

            if (failures.Count > 0)
                throw new ValidationException(failures);

            company.Name = name;
            company.Bip = bip;

            if (!string.IsNullOrEmpty(request.Logo))
                company.Logo = request.Logo;

            db.SaveChanges();
        }
    }
}
