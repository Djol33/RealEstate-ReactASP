using Application;
using Application.Command;
using Application.DTO.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.DTO;

namespace nekretnineapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstateEdit : ControllerBase
    {
        private readonly UseCaseExecutor executor;
        private readonly IWebHostEnvironment env;

        public RealEstateEdit(UseCaseExecutor executor, IWebHostEnvironment env)
        {
            this.executor = executor;
            this.env = env;
        }

        [Authorize]
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public IActionResult Put(
            long id,
            [FromForm] EditRealestateRequest request,
            [FromForm(Name = "images[]")] List<IFormFile> images,
            [FromForm(Name = "existingImageIds[]")] List<long> existingImageIds,
            [FromServices] IEditRealestate service)
        {
            var uploadsFolder = Path.Combine(env.ContentRootPath, "uploads");
            var newImagePaths = new List<string>();

            foreach (var file in images ?? new List<IFormFile>())
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                file.CopyTo(stream);
                newImagePaths.Add("images/" + fileName);
            }

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
