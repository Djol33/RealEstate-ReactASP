using Application.Security;

namespace Implementation.Security
{
    public class BCryptPasswordHasher : IPasswordHasher
    {
        private const int WorkFactor = 12;

        public string Hash(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
        }

        public bool Verify(string password, string storedHash)
        {
            if (string.IsNullOrWhiteSpace(storedHash) || string.IsNullOrEmpty(password))
                return false;

            try
            {
                return BCrypt.Net.BCrypt.Verify(password, storedHash);
            }
            catch (BCrypt.Net.SaltParseException)
            {
                return false;
            }
        }
    }
}
