using Application;

namespace nekretnineapi.Recommendations
{
    public class ViewerContext : IViewerContext
    {
        private readonly IApplicationActor actor;

        public ViewerContext(IApplicationActor actor)
        {
            this.actor = actor;
        }

        public bool IsAuthenticated => actor.Id > 0;

        public string? ViewerKey => IsAuthenticated ? $"u:{actor.Id}" : null;
    }
}
