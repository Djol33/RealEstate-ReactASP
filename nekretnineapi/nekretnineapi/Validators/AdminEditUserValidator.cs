using Application;
using Application.DTO.Command;
using FluentValidation;
using FluentValidation.Results;

namespace nekretnineapi.Validators
{
    public class AdminEditUserValidator : AbstractValidator<AdminEditUserDTO>
    {
        public const string IsCompanyKey = "IsCompany";

        public AdminEditUserValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email cannot be empty.")
                .Matches(@"^[^\s@]+@[^\s@]+\.[^\s@]+$").WithMessage("Please enter a valid email address.")
                .MaximumLength(100).WithMessage("Email cannot exceed 100 characters.");

            When(IsCompany, () =>
            {
                RuleFor(x => x.CompanyName)
                    .NotEmpty().WithMessage("Company name cannot be empty.")
                    .MaximumLength(50).WithMessage("Company name cannot exceed 50 characters.");
            });

            When(IsPerson, () =>
            {
                RuleFor(x => x.FirstName)
                    .NotEmpty().WithMessage("First name cannot be empty.")
                    .MinimumLength(3).WithMessage("First name must be at least 3 characters.")
                    .MaximumLength(30).WithMessage("First name cannot exceed 30 characters.")
                    .Must(PersonName.IsValid).WithMessage("First name must contain only letters.");

                RuleFor(x => x.LastName)
                    .NotEmpty().WithMessage("Last name cannot be empty.")
                    .MinimumLength(3).WithMessage("Last name must be at least 3 characters.")
                    .MaximumLength(30).WithMessage("Last name cannot exceed 30 characters.")
                    .Must(PersonName.IsValid).WithMessage("Last name must contain only letters.");
            });
        }

        private static bool IsCompany(AdminEditUserDTO instance, ValidationContext<AdminEditUserDTO> context)
            => context.RootContextData.TryGetValue(IsCompanyKey, out var value) && value is true;

        private static bool IsPerson(AdminEditUserDTO instance, ValidationContext<AdminEditUserDTO> context)
            => !IsCompany(instance, context);

        public ValidationResult ValidateFor(AdminEditUserDTO instance, bool isCompany)
        {
            var context = new ValidationContext<AdminEditUserDTO>(instance);
            context.RootContextData[IsCompanyKey] = isCompany;
            return Validate(context);
        }
    }
}
