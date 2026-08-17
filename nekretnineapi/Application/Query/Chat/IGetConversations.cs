using Application.DTO.Chat;
using System.Collections.Generic;

namespace Application.Query
{
    public interface IGetConversations : IQuery<int, List<ConversationSummaryDTO>>
    {
    }
}
