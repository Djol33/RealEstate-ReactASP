using Application.DTO.Command;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class ResetPasswordValidator : AbstractValidator<ResetPasswordDTO>
    {
        public ResetPasswordValidator()
        {
            RuleFor(x => x.Token)
                .NotEmpty().WithMessage("Reset token is missing.");

            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("Password cannot be empty.")
                .Matches(@"^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$")
                .WithMessage("Password must be at least 8 characters and contain a letter, a number and a special character.");
        }
    }
}
