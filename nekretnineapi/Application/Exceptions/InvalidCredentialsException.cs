using System;

namespace Application.Exceptions
{
    public class InvalidCredentialsException : Exception
    {
        public InvalidCredentialsException(string message = "Pogresan email ili lozinka.")
            : base(message)
        {
        }
    }
}
