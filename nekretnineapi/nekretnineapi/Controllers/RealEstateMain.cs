using Application;
using Application.Command;
using Application.DTO.Command;
using Application.DTO.Query;
using Application.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nekretnineapi.DTO;

namespace nekretnineapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstateMain : ControllerBase
    {
        private readonly UseCaseExecutor executor;
        private readonly IWebHostEnvironment env;

        public RealEstateMain(UseCaseExecutor executor, IWebHostEnvironment env)
        {
            this.executor = executor;
            this.env = env;
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult Get([FromQuery] RealEstateQueryDTO query, [FromServices] IShowRealEstate service)
            => Ok(executor.ExecuteQuery(service, query));

        [AllowAnonymous]
        [HttpGet("{id}")]
        public IActionResult Get(int id, [FromServices] IShowSingleRealEstate service)
            => Ok(executor.ExecuteQuery(service, id));

        [Authorize]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public IActionResult Post(
            [FromForm] AddRealestateRequest request,
            [FromForm(Name = "images[]")] List<IFormFile> images,
            [FromServices] IAddRealestate service)
        {
            var imagePaths = SaveImages(images);

            var dto = new AddRealestateDTO
            {
                Title = request.Title,
                Description = request.Description,
                Price = request.Price,
                CityId = request.CityId,
                TypeObjectId = request.TypeObjectId,
                Terrace = request.Terrace,
                Area = request.Area,
                Address = request.Address,
                NumberOfRooms = request.NumberOfRooms,
                ImagePaths = imagePaths
            };

            executor.ExecuteCommand(service, dto);
            return StatusCode(201);
        }

        [Authorize]
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public IActionResult Put(
            long id,
            [FromForm] EditRealestateRequest request,
            [FromForm(Name = "images[]")] List<IFormFile> images,
            [FromServices] IEditRealestate service)
        {
            var imagePaths = SaveImages(images);

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
                ImagePaths = imagePaths
            };

            executor.ExecuteCommand(service, dto);
            return NoContent();
        }

        private List<string> SaveImages(List<IFormFile> images)
        {
            var paths = new List<string>();
            if (images == null || !images.Any()) return paths;

            var uploadsFolder = Path.Combine(env.ContentRootPath, "uploads");
            foreach (var file in images)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                file.CopyTo(stream);
                paths.Add("images/" + fileName);
            }
            return paths;
        }
    }
}
