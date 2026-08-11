using Application;
using Application.Command;
using Application.DTO.Command;
using Application.DTO.Query;
using Application.Query;
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
    public class RealEstateMain : ControllerBase
    {
        private readonly UseCaseExecutor executor;
        private readonly ImageStorageService imageStorage;

        public RealEstateMain(UseCaseExecutor executor, ImageStorageService imageStorage)
        {
            this.executor = executor;
            this.imageStorage = imageStorage;
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
        [RequestSizeLimit(ImageStorageService.MaxRequestSizeBytes)]
        public IActionResult Post(
            [FromForm] AddRealestateRequest request,
            [FromForm(Name = "images[]")] List<IFormFile> images,
            [FromForm(Name = "amenityIds[]")] List<int> amenityIds,
            [FromServices] IAddRealestate service,
            [FromServices] AppDbContext db)
        {
            var dto = new AddRealestateDTO
            {
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
                AmenityIds = amenityIds ?? new List<int>()
            };

            var result = new AddRealestateValidator(db).Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            dto.ImagePaths = imageStorage.Save(images);

            executor.ExecuteCommand(service, dto);
            return StatusCode(201);
        }

        [Authorize]
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(ImageStorageService.MaxRequestSizeBytes)]
        public IActionResult Put(
            long id,
            [FromForm] EditRealestateRequest request,
            [FromForm(Name = "images[]")] List<IFormFile> images,
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
            };

            var result = new EditRealestateValidator(db).Validate(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);

            dto.ImagePaths = imageStorage.Save(images);

            executor.ExecuteCommand(service, dto);
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult Delete(long id, [FromServices] IDeleteRealestate service)
        {
            executor.ExecuteCommand(service, id);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost("{id}/view")]
        public IActionResult TrackView(long id, [FromServices] ITrackView service)
        {
            executor.ExecuteCommand(service, id);
            return NoContent();
        }

        [Authorize]
        [HttpPost("{id}/view-duration")]
        public IActionResult TrackViewDuration(long id, [FromBody] TrackViewDurationRequest body, [FromServices] ITrackViewDuration service)
        {
            executor.ExecuteCommand(service, new TrackViewDurationDTO { RealestateId = id, DurationSeconds = body.DurationSeconds });
            return NoContent();
        }

        public class TrackViewDurationRequest
        {
            public int DurationSeconds { get; set; }
        }

        [Authorize]
        [HttpGet("{id}/analytics")]
        public IActionResult Analytics(long id, [FromServices] IGetRealestateAnalytics service)
            => Ok(executor.ExecuteQuery(service, id));
    }
}
