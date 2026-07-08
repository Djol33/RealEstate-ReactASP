using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class AddRealestateValidator : AbstractValidator<AddRealestateDTO>
    {
        private readonly AppDbContext db;

        public AddRealestateValidator(AppDbContext db)
        {
            this.db = db;

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Naslov ne sme biti prazan.")
                .MaximumLength(200).WithMessage("Naslov ne sme biti duži od 200 karaktera.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Opis ne sme biti prazan.")
                .MinimumLength(20).WithMessage("Opis mora imati najmanje 20 karaktera.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Cena mora biti veća od 0.");

            RuleFor(x => x.Area)
                .GreaterThan(0).WithMessage("Površina mora biti veća od 0.");

            RuleFor(x => x.NumberOfRooms)
                .GreaterThan(0).WithMessage("Broj soba mora biti veći od 0.");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Adresa ne sme biti prazna.");

            RuleFor(x => x.CityId)
                .GreaterThan(0).WithMessage("Grad mora biti izabran.")
                .Must(cityId => db.Cities.Any(c => c.Id == cityId))
                .WithMessage("Izabrani grad ne postoji.");

            RuleFor(x => x.TypeObjectId)
                .GreaterThan(0).WithMessage("Tip objekta mora biti izabran.")
                .Must(typeId => db.TipObjekta.Any(t => t.Id == typeId))
                .WithMessage("Izabrani tip objekta ne postoji.");
        }
    }
}
