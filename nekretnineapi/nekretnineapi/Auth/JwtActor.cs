using Application;

namespace nekretnineapi.Auth
{
    public class JwtActor : IApplicationActor
    {
        private readonly int _id;
        private readonly string _email;
        private readonly int _userRole;

        public JwtActor(string id, string email, string userRole)
        {
            _id = int.Parse(id);
            _email = email;
            _userRole = int.TryParse(userRole, out var role) ? role : 0;
        }

        public int Id => _id;
        public string Email => _email;
        public int UserRole => _userRole;
    }
}
