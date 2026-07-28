using System;

namespace Application.Exceptions
{
    public class AccountDeactivatedException : Exception
    {
        public AccountDeactivatedException(string message = "This account has been deactivated.")
            : base(message)
        {
        }
    }
}
