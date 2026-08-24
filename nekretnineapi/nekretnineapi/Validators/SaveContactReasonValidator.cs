using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class SaveContactReasonValidator : AbstractValidator<SaveContactReasonDTO>
    {
        public SaveContactReasonValidator(AppDbContext db)
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Reason name cannot be empty.")
                .MaximumLength(80).WithMessage("Reason name cannot exceed 80 characters.")
                .Must((dto, name) => !db.ContactReasons.Any(r => r.Name == name && r.Id != dto.Id && r.IsActive))
                .WithMessage("A reason with this name already exists.")
                .Must((dto, name) => !db.ContactReasons.Any(r => r.Name == name && r.Id != dto.Id && !r.IsActive))
                .WithMessage("A reason with this name was previously deleted. Restore it instead of creating a new one.");
        }
    }
}
