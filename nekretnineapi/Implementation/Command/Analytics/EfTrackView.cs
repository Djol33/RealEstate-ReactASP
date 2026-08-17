using Application;
using Application.Command;
using DataDomain.Entities;

namespace Implementation.Command
{
    public class EfTrackView : ITrackView
    {
        public int Id => 20;
        public string Name => "Track View";

        private readonly AppDbContext db;
        private readonly IViewerContext viewer;

        public EfTrackView(AppDbContext db, IViewerContext viewer)
        {
            this.db = db;
            this.viewer = viewer;
        }

        public void Execute(long realestateId)
        {
            var key = viewer.ViewerKey;
            if (string.IsNullOrEmpty(key))
                return;

            var exists = db.Realestates.Any(r => r.Id == realestateId);
            if (!exists)
                return;

            db.RealestateViews.Add(new RealestateView
            {
                ViewerKey = key,
                RealestateId = realestateId,
                ViewedAt = DateTime.UtcNow
            });

            db.SaveChanges();
        }
    }
}
