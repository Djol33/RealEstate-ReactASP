using Application.DTO.Command;

namespace Application.Command
{
    public interface IToggleWishlist : ICommand<WishlistToggleDTO>
    {
    }
}
