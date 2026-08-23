using Application;
using Application.DTO.Command;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class EditProfileValidator : AbstractValidator<EditProfileDTO>
    {
        public EditProfileValidator()
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
        }
    }
}
