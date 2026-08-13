namespace Application
{
    public interface IViewerContext
    {
        string? ViewerKey { get; }
        bool IsAuthenticated { get; }
    }
}
