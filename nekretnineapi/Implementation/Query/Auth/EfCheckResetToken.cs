using Application.Query;
using DataDomain.Entities;
using Implementation.Command;

namespace Implementation.Query.Auth
{
    public class EfCheckResetToken : ICheckResetToken
    {
        public int Id => 57;
        public string Name => "Check Reset Token";

        private readonly AppDbContext db;

        public EfCheckResetToken(AppDbContext db)
        {
            this.db = db;
        }

        public bool Execute(string request)
        {
            var raw = (request ?? "").Trim();
            if (raw.Length == 0)
                return false;

            var tokenHash = EfRequestPasswordReset.Hash(raw);

            return db.PasswordResetTokens
                .Any(t => t.TokenHash == tokenHash && t.UsedAt == null && t.ExpiresAt > DateTime.Now);
        }
    }
}
