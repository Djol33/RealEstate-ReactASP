using Application.DTO.Command;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class SaveContactReasonValidator : AbstractValidator<SaveContactReasonDTO>
    {
        public SaveContactReasonValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Reason name cannot be empty.")
                .MaximumLength(80).WithMessage("Reason name cannot exceed 80 characters.");
        }
    }
}
