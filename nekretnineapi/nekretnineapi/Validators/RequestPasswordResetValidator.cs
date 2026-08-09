using Application.DTO.Command;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class RequestPasswordResetValidator : AbstractValidator<RequestPasswordResetDTO>
    {
        public RequestPasswordResetValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email cannot be empty.")
                .EmailAddress().WithMessage("Please enter a valid email address.");
        }
    }
}
