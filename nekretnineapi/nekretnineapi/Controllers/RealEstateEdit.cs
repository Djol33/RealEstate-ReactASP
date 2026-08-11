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
        public IActionResult Put(
            long id,
            [FromForm] EditRealestateRequest request,
            [FromForm(Name = "images[]")] List<IFormFile> images,
            [FromForm(Name = "existingImageIds[]")] List<long> existingImageIds,
            [FromForm(Name = "amenityIds[]")] List<int> amenityIds,
            [FromServices] IEditRealestate service,
            [FromServices] AppDbContext db)
        {
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
                ExistingImageIds = existingImageIds ?? new List<long>(),
                AmenityIds = amenityIds ?? new List<int>()
            };

            var result = new EditRealestateValidator(db).Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            dto.ImagePaths = imageStorage.Save(images);

            executor.ExecuteCommand(service, dto);
            return NoContent();
        }
    }
}
