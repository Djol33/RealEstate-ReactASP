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

        public EfSaveAmenity(AppDbContext db)
        {
            this.db = db;
        }

        public void Execute(SaveAmenityDTO request)
        {

            var name = request.Name ?? "";


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
