using Application.DTO.Command;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class SaveAmenityValidator : AbstractValidator<SaveAmenityDTO>
    {
        public SaveAmenityValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Amenity name cannot be empty.")
                .MaximumLength(50).WithMessage("Amenity name cannot exceed 50 characters.");
        }
    }
}
