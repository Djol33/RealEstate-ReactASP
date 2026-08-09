using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;

namespace nekretnineapi.Validators
{
    public class AddRealestateValidator : AbstractValidator<AddRealestateDTO>
    {
        private readonly AppDbContext db;

        public AddRealestateValidator(AppDbContext db)
        {
            this.db = db;

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title cannot be empty.")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description cannot be empty.")
                .MinimumLength(20).WithMessage("Description must be at least 20 characters.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0.")
                .LessThanOrEqualTo(100_000_000).WithMessage("Price cannot exceed 100,000,000.");

            RuleFor(x => x.Area)
                .GreaterThan(0).WithMessage("Area must be greater than 0.")
                .LessThanOrEqualTo(10_000).WithMessage("Area cannot exceed 10,000 m².");

            RuleFor(x => x.NumberOfRooms)
                .InclusiveBetween(0.5f, 10f).WithMessage("Number of rooms must be between 0.5 and 10.");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Address cannot be empty.");

            RuleFor(x => x.CityId)
                .GreaterThan(0).WithMessage("A city must be selected.")
                .Must(cityId => db.Cities.Any(c => c.Id == cityId))
                .WithMessage("Selected city does not exist.");

            RuleFor(x => x.TypeObjectId)
                .GreaterThan(0).WithMessage("A property type must be selected.")
                .Must(typeId => db.TipObjekta.Any(t => t.Id == typeId))
                .WithMessage("Selected property type does not exist.");
        }
    }
}
