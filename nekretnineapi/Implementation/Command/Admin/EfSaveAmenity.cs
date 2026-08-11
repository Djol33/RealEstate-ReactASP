using Application;
using Application.Command.Admin;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.Results;

namespace Implementation.Command.Admin
{
    public class EfSaveAmenity : ISaveAmenity
    {
        public int Id => 44;
        public string Name => "Save Amenity";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfSaveAmenity(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(SaveAmenityDTO request)
        {
            if (actor.UserRole != UserRoles.Admin)
                throw new UnauthorizedAccessException("Only an administrator can manage amenities.");

            var name = (request.Name ?? "").Trim();
            if (string.IsNullOrWhiteSpace(name))
                throw new ValidationException(new[] { new ValidationFailure("name", "Amenity name cannot be empty.") });
            if (name.Length > 50)
                throw new ValidationException(new[] { new ValidationFailure("name", "Amenity name cannot exceed 50 characters.") });

            var conflicting = db.Amenities.FirstOrDefault(a => a.Name == name && a.Id != request.Id);
            if (conflicting != null)
            {
                var message = conflicting.IsActive
                    ? "An amenity with this name already exists."
                    : "An amenity with this name was previously deleted. Restore it instead of creating a new one.";
                throw new ValidationException(new[] { new ValidationFailure("name", message) });
            }

            if (request.Id > 0)
            {
                var amenity = db.Amenities.FirstOrDefault(a => a.Id == request.Id)
                    ?? throw new KeyNotFoundException("Amenity not found.");

                amenity.Name = name;
                amenity.IsFilterable = request.IsFilterable;
            }
            else
            {
                db.Amenities.Add(new Amenity
                {
                    Name = name,
                    IsFilterable = request.IsFilterable,
                    CreatedAt = DateTime.Now
                });
            }

            db.SaveChanges();
        }
    }
}
