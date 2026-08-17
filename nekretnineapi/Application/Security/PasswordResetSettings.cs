namespace Application.Security
{
    public class PasswordResetSettings
    {
        public const string SectionName = "PasswordReset";

        public string ResetUrlBase { get; set; } = "http://localhost:5173/auth/reset-password";
    }
}
