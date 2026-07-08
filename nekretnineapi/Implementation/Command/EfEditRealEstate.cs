using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;

namespace Implementation.Command
{
    public class EfEditRealEstate : IEditRealestate
    {
        public int Id => 12;
        public string Name => "Edit Real Estate";

        private readonly AppDbContext db;
        private readonly IApplicationActor actor;

        public EfEditRealEstate(AppDbContext db, IApplicationActor actor)
        {
            this.db = db;
            this.actor = actor;
        }

        public void Execute(EditRealestateDTO request)
        {
            var realestate = db.Realestates
                .FirstOrDefault(r => r.Id == request.Id)
                ?? throw new KeyNotFoundException("Nekretnina nije pronađena.");

           
            bool isOwner = realestate.Owner == actor.Id;

            if (  !isOwner)
                throw new UnauthorizedAccessException("Nemate dozvolu da menjate ovu nekretninu.");

            realestate.Title = request.Title;
            realestate.Description = request.Description;
            realestate.Price = request.Price;
            realestate.City = request.CityId;
            realestate.TypeObject = (short)request.TypeObjectId;
            realestate.Terrace = request.Terrace;
            realestate.Area = request.Area;
            realestate.Adress = request.Address;
            realestate.NumberOfRooms = request.NumberOfRooms;

            // brisi slike koje korisnik nije zadrzao
            var toDelete = db.RealestateImages
                .Where(i => i.IdPost == realestate.Id && !request.ExistingImageIds.Contains(i.Id))
                .ToList();
            db.RealestateImages.RemoveRange(toDelete);

            // dodaj nove slike
            foreach (var path in request.ImagePaths)
            {
                realestate.RealestateImages.Add(new RealestateImage
                {
                    Location = path,
                    Alt = Path.GetFileName(path)
                });
            }

            db.SaveChanges();
        }
    }
}
