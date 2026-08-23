using Application.DTO;
using Application.DTO.Query;

namespace Application.Query
{
    public interface IShowUserRealEstate : IQuery<UserListingsQueryDTO, RealEstatePagedDTO>
    {
    }
}
