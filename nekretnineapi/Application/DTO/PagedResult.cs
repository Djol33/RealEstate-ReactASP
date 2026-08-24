namespace Application.DTO
{
    public class PagedResult<T>
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public List<T> Data { get; set; } = new();
    }

    public static class Paging
    {
        public const int DefaultPageSize = 10;

        public static PagedResult<T> Build<T>(IQueryable<T> query, int page, int pageSize = DefaultPageSize)
        {
            if (page < 1) page = 1;

            var totalCount = query.Count();
            var totalPages = totalCount == 0 ? 1 : (int)Math.Ceiling(totalCount / (double)pageSize);
            if (page > totalPages) page = totalPages;

            return new PagedResult<T>
            {
                CurrentPage = page,
                TotalPages = totalPages,
                TotalCount = totalCount,
                Data = query.Skip((page - 1) * pageSize).Take(pageSize).ToList()
            };
        }
    }
}
