using System;
using System.Collections.Generic;

namespace DataDomain.Entities;

public partial class SurveyAnswer
{
    public int Id { get; set; }

    public long UserId { get; set; }

    public int SurveyId { get; set; }

    public int Value { get; set; }
}
