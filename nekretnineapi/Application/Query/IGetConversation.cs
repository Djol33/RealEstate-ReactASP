using Application.DTO.Chat;
using System.Collections.Generic;

namespace Application.Query
{
    public interface IGetConversation : IQuery<int, List<MessageDTO>>
    {
    }
}
