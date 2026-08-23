using Application.DTO;
using Application.DTO.Query;

namespace Application.Query
{
    public interface IShowWishlist : IQuery<UserListingsQueryDTO, RealEstatePagedDTO>
    {
    }
}
