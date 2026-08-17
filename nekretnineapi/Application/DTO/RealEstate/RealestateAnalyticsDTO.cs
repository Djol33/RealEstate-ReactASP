using System;
using System.Collections.Generic;

namespace Application.DTO
{
    public class RealestateAnalyticsDTO
    {
        public int TotalViews { get; set; }
        public int WishlistCount { get; set; }
        public double? AverageDurationSeconds { get; set; }
        public List<DailyViewCount> ViewsByDay { get; set; } = new();
    }

    public class DailyViewCount
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
    }
}
