using Application;
using Application.Command;
using Application.DTO.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.DTO;
using nekretnineapi.Services;

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
            [FromServices] IEditRealestate service)
        {
            var newImagePaths = imageStorage.Save(images);

            var dto = new EditRealestateDTO
            {
                Id = id,
                Title = request.Title,
                Description = request.Description,
                Price = request.Price,
                CityId = request.CityId,
                TypeObjectId = request.TypeObjectId,
                Terrace = request.Terrace,
                Area = request.Area,
                Address = request.Address,
                NumberOfRooms = request.NumberOfRooms,
                ImagePaths = newImagePaths,
                ExistingImageIds = existingImageIds ?? new List<long>()
            };

            executor.ExecuteCommand(service, dto);
            return NoContent();
        }
    }
}
