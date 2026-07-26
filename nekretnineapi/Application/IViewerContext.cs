namespace Application
{
    /// <summary>
    /// Apstrakcija identiteta posetioca za tracking/preporuke.
    /// Sada: ulogovani -> "u:{id}", anonimni -> null (ne beleže se).
    /// Kasnije skaliranje na anonimne: dodati "a:{sessionId}" bez menjanja ostatka.
    /// </summary>
    public interface IViewerContext
    {
        string? ViewerKey { get; }
        bool IsAuthenticated { get; }
    }
}
