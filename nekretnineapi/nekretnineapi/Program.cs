using Application;
using Application.Command;
using Application.Query;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.AspNetCore;
using Implementation.Command;
using Implementation.Query;
using Implementation.Query.City;
using Implementation.Query.RealEstate;
using Implementation.Query.TypeOfRealestate;
using Implementation.Query.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using nekretnineapi;
using nekretnineapi.Auth;
using nekretnineapi.Validators;
using Application.Exceptions;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.AllowAnyOrigin()  
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
builder.Services.AddHttpContextAccessor();

// Add services to the container.
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.SuppressModelStateInvalidFilter = true;
    });

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));
var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>()
    ?? throw new InvalidOperationException("Nedostaje 'Jwt' sekcija u konfiguraciji.");

if (string.IsNullOrWhiteSpace(jwtSettings.Key) || Encoding.UTF8.GetByteCount(jwtSettings.Key) < 32)
    throw new InvalidOperationException(
        "Jwt:Key nije podesen ili je prekratak (min 32 bajta). Podesi ga preko User Secrets ili env varijable 'Jwt__Key'.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<AppDbContext>();
builder.Services.AddTransient<UseCaseExecutor>(x => new UseCaseExecutor(x));

builder.Services.AddSingleton<Application.Security.ITokenFactory, nekretnineapi.Auth.JwtTokenFactory>();
builder.Services.AddSingleton<Application.Security.IPasswordHasher, Implementation.Security.Pbkdf2PasswordHasher>();
builder.Services.AddTransient<Application.Command.ILogin, Implementation.Command.EfLogin>();
builder.Services.AddTransient<IShowRealEstate, EfShowRealEstate>();
builder.Services.AddTransient<ICitySearch, EfCity>();
builder.Services.AddTransient<IRegesiter, EfRegisterUser > ();
builder.Services.AddTransient<IRegisterCompany, EfRegisterCompany>();
builder.Services.AddDbContext<AppDbContext>(ServiceLifetime.Scoped);
builder.Services.AddTransient<IUserProfile, EFUserProfile>();
builder.Services.AddTransient<IShowTypeOfRealestate, TypeOfRealestateEf>();
builder.Services.AddTransient<IShowAllCities, EfShowAllCities>();
builder.Services.AddScoped<IApplicationActor>(x =>
{
    var user = x.GetRequiredService<IHttpContextAccessor>().HttpContext?.User;

    if (user?.Identity is not { IsAuthenticated: true })
        return new GuestActor();

    var id = user.FindFirst("Id")?.Value;
    var email = user.FindFirst("Email")?.Value;
    var userRole = user.FindFirst("UserRole")?.Value ?? "0";

    if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(email))
        return new GuestActor();

    return new JwtActor(id, email, userRole);
});

builder.Services.AddScoped<IShowSingleRealEstate, SingleRealEstate>();
builder.Services.AddHttpClient("nominatim", client =>
{
    client.BaseAddress = new Uri("https://nominatim.openstreetmap.org");
    client.DefaultRequestHeaders.Add("User-Agent", "nekretnineapi/1.0");
});
builder.Services.AddScoped<IAddRealestate, EfAddRealEstate>();
builder.Services.AddScoped<IEditRealestate, EfEditRealEstate>();

builder.Services.AddValidatorsFromAssemblyContaining<AddRealestateValidator>();

var app = builder.Build();

app.UseExceptionHandler(appError =>
{
    appError.Run(async context =>
    {
        var feature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        var ex = feature?.Error;

        if (ex is FluentValidation.ValidationException validationEx)
        {
            context.Response.StatusCode = 422;
            context.Response.ContentType = "application/json";
            var errors = validationEx.Errors.Select(e => new { property = e.PropertyName, error = e.ErrorMessage });
            await context.Response.WriteAsJsonAsync(new { errors });
            return;
        }

        if (ex is InvalidCredentialsException)
        {
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
            return;
        }

        if (ex is UnauthorizedAccessException)
        {
            context.Response.StatusCode = 403;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
            return;
        }

        if (ex is KeyNotFoundException)
        {
            context.Response.StatusCode = 404;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
            return;
        }

        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = "Došlo je do greške na serveru." });
    });
});


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

 var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

 app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/images"
});

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/uvoz", async (AppDbContext db) =>
{
    var putanja = @"C:\Users\Nemanja\Desktop\RS.txt";  

    var linije = await File.ReadAllLinesAsync(putanja);
    var mesta = new List<GeoMesto>();

    foreach (var linija in linije)
    {
        var k = linija.Split('\t');
        if (k.Length < 14) continue;
        if (k[6] != "P") continue;

        if (!double.TryParse(k[4], NumberStyles.Any, CultureInfo.InvariantCulture, out var lat)) continue;
        if (!double.TryParse(k[5], NumberStyles.Any, CultureInfo.InvariantCulture, out var lng)) continue;

        int.TryParse(k[13], out var pop);

        mesta.Add(new GeoMesto
        {
            Naziv = k[1],
            Lat = lat,
            Lng = lng,
            Populacija = pop
        });
    }

    db.GeoMesta.AddRange(mesta);
    await db.SaveChangesAsync();

    return $"Uvezeno {mesta.Count} mesta";
});
app.Run();
