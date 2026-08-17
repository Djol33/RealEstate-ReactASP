using Application;
using Application.DTO;
using Application.Query;
using DataDomain.Entities;
using HeroBannerStatusConst = Application.HeroBannerStatus;

namespace Implementation.Query.RealEstate
{
    public class SingleRealEstate : IShowSingleRealEstate
    {
        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public int Id => 3;
        public string Name => "Single real estate";

        public SingleRealEstate(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public RealEstateDTO Execute(int request)
        {
            var isLoggedIn = actor.Id > 0;

            var realestate = this.db.Realestates
                .Where(a => a.Id == request && (a.IsActive == 1 || a.Owner == actor.Id || actor.UserRole == UserRoles.Admin))
                .Select(a => new RealEstateDTO
                {
                    Id = a.Id,
                    Area = a.Area,
                    Description = a.Description,
                    TypeObjectName = a.TypeObjectNavigation.Naziv,
                    Price = a.Price,
                    NumberOfRooms = a.NumberOfRooms,
                    Terrace = a.Terrace,
                    Registered = a.Registered,
                    Status = a.Status,
                    Title = a.Title,
                    CityId = db.Cities.Where(c => c.Id == a.City).Select(c => c.Id).FirstOrDefault(),
                    TypeObject=a.TypeObjectNavigation.Id,
                    CityName = db.Cities.Where(c => c.Id == a.City).Select(c => c.City1).FirstOrDefault() ?? string.Empty,
                    Adress = a.Adress,
                    Images = a.RealestateImages.Select(x => new Images
                    {
                        Id = x.Id,
                        Location = x.Location
                    }).ToList(),
                    Amenities = a.Amenities.Select(am => new AmenityDTO
                    {
                        Id = am.Id,
                        Name = am.Name,
                        IsFilterable = am.IsFilterable
                    }).ToList(),
                    CanEdit = a.Owner == actor.Id || actor.UserRole == UserRoles.Admin,
                    CanDelete = a.Owner == actor.Id || actor.UserRole == UserRoles.Admin,
                    IsWishlisted = a.Wishlists.Any(w => w.UserId == actor.Id),
                    Lng = a.Lng ?? null,
                    Lat = a.Lat ??null,
                    Owner = a.Owner,
                    Email = db.Users.Where(u => u.Id == a.Owner).Select(u => u.Email).FirstOrDefault(),
                    F_name = db.Users.Where(u => u.Id == a.Owner).SelectMany(u => u.UserBasics).Select(b => b.FirstName).FirstOrDefault()
                        ?? db.Companies.Where(c => c.FkId == a.Owner).Select(c => c.Name).FirstOrDefault(),
                    L_name = db.Users.Where(u => u.Id == a.Owner).SelectMany(u => u.UserBasics).Select(b => b.LastName).FirstOrDefault() ?? string.Empty
                })
                .FirstOrDefault()
                ?? throw new KeyNotFoundException("Listing not found.");

            if (realestate.Owner == actor.Id)
            {
                var isCompany = db.Companies.Any(c => c.FkId == actor.Id);
                var latestRequest = db.HeroBannerRequests
                    .Where(h => h.RealestateId == realestate.Id)
                    .OrderByDescending(h => h.Id)
                    .FirstOrDefault();

                var hasPendingOrActive = latestRequest != null &&
                    (latestRequest.Status == HeroBannerStatusConst.Pending ||
                     (latestRequest.Status == HeroBannerStatusConst.Approved && latestRequest.EndsAt > DateTime.Now));

                realestate.CanRequestHeroBanner = isCompany && !hasPendingOrActive;
                realestate.HeroBannerStatus = latestRequest?.Status switch
                {
                    HeroBannerStatusConst.Pending => "Pending",
                    HeroBannerStatusConst.Approved when latestRequest.EndsAt > DateTime.Now => "Approved",
                    _ => null
                };
                realestate.CanViewAnalytics = isCompany;
            }

            if (!isLoggedIn)
            {
                realestate.F_name = string.IsNullOrEmpty(realestate.F_name) ? "" : realestate.F_name[0] + ".";
                realestate.L_name = string.IsNullOrEmpty(realestate.L_name) ? "" : realestate.L_name[0] + ".";
                realestate.Email = MaskEmail(realestate.Email);
            }

            return realestate;
        }

        private static string MaskEmail(string email)
        {
            if (string.IsNullOrEmpty(email)) return email;

            var atIndex = email.IndexOf('@');
            if (atIndex <= 1) return email;

            var visible = email.Substring(0, 2);
            return visible + new string('*', atIndex - 2) + email.Substring(atIndex);
        }
    }
}
