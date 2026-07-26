using Microsoft.AspNetCore.SignalR;

namespace nekretnineapi.Auth
{
    public class ClaimUserIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            return connection.User?.FindFirst("Id")?.Value;
        }
    }
}
