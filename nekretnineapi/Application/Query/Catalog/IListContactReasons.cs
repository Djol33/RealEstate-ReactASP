using Application.DTO;
using System.Collections.Generic;

namespace Application.Query
{
    public interface IListContactReasons : IQuery<int, List<ContactReasonDTO>>
    {
    }
}
