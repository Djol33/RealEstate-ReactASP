using Application;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class EditCompanyValidator : AbstractValidator<EditCompanyDTO>
    {
        public EditCompanyValidator(AppDbContext db, IApplicationActor actor)
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Company name cannot be empty.")
                .MaximumLength(50).WithMessage("Company name cannot exceed 50 characters.");

            RuleFor(x => x.BIP)
                .NotEmpty().WithMessage("Tax ID (PIB) cannot be empty.")
                .Must(Pib.IsValid).WithMessage("Tax ID (PIB) must be 9 digits and a valid Serbian PIB.")
                .Must(bip => !db.Companies.Any(c => c.Bip == bip && c.FkId != actor.Id))
                .WithMessage("This Tax ID is already in use.");
        }
    }
}
