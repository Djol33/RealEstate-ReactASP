namespace Application.Security
{
    public interface ITokenFactory
    {
        string Create(int id, string email, int userRole);
    }
}
