using Application;
using Application.DTO.Command;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class SetRoleValidator : AbstractValidator<SetRoleDTO>
    {
        public SetRoleValidator()
        {
            RuleFor(x => x.Role)
                .Must(role => role == UserRoles.User || role == UserRoles.Admin)
                .WithMessage("Invalid role.");
        }
    }
}
