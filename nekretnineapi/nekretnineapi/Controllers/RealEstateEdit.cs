using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.DTO;
using nekretnineapi.Services;
using nekretnineapi.Validators;

namespace nekretnineapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstateEdit : ControllerBase
    {
        private readonly UseCaseExecutor executor;
        private readonly ImageStorageService imageStorage;

        public RealEstateEdit(UseCaseExecutor executor, ImageStorageService imageStorage)
        {
            this.executor = executor;
            this.imageStorage = imageStorage;
        }

        [Authorize]
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(ImageStorageService.MaxRequestSizeBytes)]
        public async Task<IActionResult> Put(
            long id,
            [FromForm] EditRealestateRequest request,
            [FromForm(Name = "images[]")] List<IFormFile> images,
            [FromForm(Name = "existingImageIds[]")] List<long> existingImageIds,
            [FromForm(Name = "amenityIds[]")] List<int> amenityIds,
            [FromServices] IEditRealestate service,
            [FromServices] GeocodingService geocodingService,
            [FromServices] AppDbContext db)
        {
            var current = db.Realestates.FirstOrDefault(r => r.Id == id);
            bool addressChanged = current != null && (current.City != request.CityId || current.Adress != request.Address);

            var dto = new EditRealestateDTO
            {
                Id = id,
                Title = request.Title,
                Description = request.Description,
                Price = request.Price,
                CityId = request.CityId,
                TypeObjectId = request.TypeObjectId,
                Terrace = request.Terrace,
                Registered = request.Registered,
                Area = request.Area,
                Address = request.Address,
                NumberOfRooms = request.NumberOfRooms,
                Status = request.Status,
                ExistingImageIds = existingImageIds ?? new List<long>(),
                AmenityIds = amenityIds ?? new List<int>()
            };

            if (addressChanged && !string.IsNullOrWhiteSpace(request.Address))
            {
                var cityName = db.Cities.Where(c => c.Id == request.CityId).Select(c => c.City1).FirstOrDefault() ?? string.Empty;
                var coords = await geocodingService.GetCoordinates($"{request.Address}, {cityName}");
                if (coords.HasValue)
                {
                    dto.Lat = coords.Value.lat;
                    dto.Lng = coords.Value.lng;
                }
            }

            var result = new EditRealestateValidator(db).Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            dto.ImagePaths = imageStorage.Save(images);

            executor.ExecuteCommand(service, dto);
            return NoContent();
        }
    }
}
