using Application.DTO.Command;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class AdminEditUserValidator : AbstractValidator<AdminEditUserDTO>
    {
        public AdminEditUserValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email cannot be empty.")
                .Matches(@"^[^\s@]+@[^\s@]+\.[^\s@]+$").WithMessage("Please enter a valid email address.")
                .MaximumLength(100).WithMessage("Email cannot exceed 100 characters.");

            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name cannot be empty.")
                .MinimumLength(3).WithMessage("First name must be at least 3 characters.")
                .MaximumLength(30).WithMessage("First name cannot exceed 30 characters.")
                .Matches(@"\p{L}").WithMessage("First name must contain at least one letter.");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name cannot be empty.")
                .MinimumLength(3).WithMessage("Last name must be at least 3 characters.")
                .MaximumLength(30).WithMessage("Last name cannot exceed 30 characters.")
                .Matches(@"\p{L}").WithMessage("Last name must contain at least one letter.");
        }
    }
}
