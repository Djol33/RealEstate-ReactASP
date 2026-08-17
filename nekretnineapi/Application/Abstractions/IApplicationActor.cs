namespace Application
{
    public interface IApplicationActor
    {
        public int Id { get; }
        public string Email { get; }
        public int UserRole { get; }
    }
}
