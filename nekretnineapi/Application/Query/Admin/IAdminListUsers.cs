using Application.DTO.Admin;

namespace Application.Query.Admin
{
    public interface IAdminListUsers : IQuery<AdminUserQueryDTO, AdminUserPagedDTO>
    {
    }
}
