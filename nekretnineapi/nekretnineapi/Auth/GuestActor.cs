using Application;

namespace nekretnineapi.Auth
{
    public class GuestActor : IApplicationActor
    {
        public int Id => 0;
        public string Email => "guest";
        public int UserRole => 0;
    }
}
