using System.Security.Cryptography;
using System.Text;
using Application;
using Application.Command;
using Application.DTO.Command;
using Application.Email;
using DataDomain.Entities;

namespace Implementation.Command
{
    public class EfRequestPasswordReset : IRequestPasswordReset
    {
        public int Id => 30;
        public string Name => "Request Password Reset";

        private readonly AppDbContext db;
        private readonly IEmailSender email;

        public EfRequestPasswordReset(AppDbContext db, IEmailSender email)
        {
            this.db = db;
            this.email = email;
        }

        public void Execute(RequestPasswordResetDTO request)
        {
            var address = (request.Email ?? "").Trim();
            if (address.Length == 0)
                return;

            var user = db.Users.FirstOrDefault(u => u.Email == address);
            if (user == null || user.IsActive != 1)
                return;

            var rawToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

            db.PasswordResetTokens.Add(new PasswordResetToken
            {
                UserId = user.Id,
                TokenHash = Hash(rawToken),
                ExpiresAt = DateTime.Now.AddHours(1),
                CreatedAt = DateTime.Now
            });
            db.SaveChanges();

            var baseUrl = string.IsNullOrWhiteSpace(request.ResetUrlBase)
                ? "http://localhost:5173/auth/reset-password"
                : request.ResetUrlBase.TrimEnd('/');
            var link = $"{baseUrl}?token={rawToken}";

            var body =
                "<p>You requested a password reset.</p>" +
                $"<p><a href=\"{link}\">Click here to set a new password</a>. This link expires in 1 hour.</p>" +
                "<p>If you did not request this, you can ignore this email.</p>";

            email.Send(address, "Password reset", body);
        }

        public static string Hash(string token)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
            return Convert.ToHexString(bytes);
        }
    }
}
