using System;
using System.Collections.Generic;

namespace Application
{
    public static class ReportReason
    {
        public static readonly HashSet<string> Allowed = new(StringComparer.OrdinalIgnoreCase)
        {
            "spam", "fraud", "inappropriate", "wrong_info", "other"
        };

        public static bool IsValid(string reason)
            => !string.IsNullOrWhiteSpace(reason) && Allowed.Contains(reason);
    }
}
