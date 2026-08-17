using Application;
using Application.Command;
using Application.DTO.Command;
using DataDomain.Entities;

namespace Implementation.Command
{
    public class EfTrackViewDuration : ITrackViewDuration
    {
        public int Id => 41;
        public string Name => "Track View Duration";

        private readonly AppDbContext db;
        private readonly IViewerContext viewer;

        public EfTrackViewDuration(AppDbContext db, IViewerContext viewer)
        {
            this.db = db;
            this.viewer = viewer;
        }

        public void Execute(TrackViewDurationDTO request)
        {
            var key = viewer.ViewerKey;
            if (string.IsNullOrEmpty(key))
                return;

            if (request.DurationSeconds < 1 || request.DurationSeconds > 3600)
                return;

            var view = db.RealestateViews
                .Where(v => v.RealestateId == request.RealestateId && v.ViewerKey == key)
                .OrderByDescending(v => v.Id)
                .FirstOrDefault();

            if (view == null)
                return;

            view.DurationSeconds = request.DurationSeconds;
            db.SaveChanges();
        }
    }
}
