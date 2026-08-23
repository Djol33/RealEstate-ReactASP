using Application;
using Application.DTO.Command;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class EditCompanyValidator : AbstractValidator<EditCompanyDTO>
    {
        public EditCompanyValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Company name cannot be empty.")
                .MaximumLength(50).WithMessage("Company name cannot exceed 50 characters.");

            RuleFor(x => x.BIP)
                .NotEmpty().WithMessage("Tax ID (PIB) cannot be empty.")
                .Must(Pib.IsValid).WithMessage("Tax ID (PIB) must be 9 digits and a valid Serbian PIB.");
        }
    }
}
