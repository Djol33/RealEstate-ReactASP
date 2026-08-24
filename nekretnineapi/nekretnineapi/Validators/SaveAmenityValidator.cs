using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class SaveAmenityValidator : AbstractValidator<SaveAmenityDTO>
    {
        public SaveAmenityValidator(AppDbContext db)
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Amenity name cannot be empty.")
                .MaximumLength(50).WithMessage("Amenity name cannot exceed 50 characters.")
                .Must((dto, name) => !db.Amenities.Any(a => a.Name == name && a.Id != dto.Id && a.IsActive))
                .WithMessage("An amenity with this name already exists.")
                .Must((dto, name) => !db.Amenities.Any(a => a.Name == name && a.Id != dto.Id && !a.IsActive))
                .WithMessage("An amenity with this name was previously deleted. Restore it instead of creating a new one.");
        }
    }
}
