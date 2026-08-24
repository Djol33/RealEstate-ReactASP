using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;

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

            company.Name = name;
            company.Bip = bip;

            if (!string.IsNullOrEmpty(request.Logo))
                company.Logo = request.Logo;

            db.SaveChanges();
        }
    }
}
