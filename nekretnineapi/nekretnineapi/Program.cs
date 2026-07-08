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
using nekretnineapi;
using nekretnineapi.Validators;
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
builder.Services.AddControllers();
builder.Services.AddTransient<JWTManager>(x =>
{
    var context = x.GetService<AppDbContext>();
   
    return new JWTManager(context);
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "yourdomain.com",
            ValidAudience = "yourdomain.com",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_super_secret_key_ndsfknfdsklndfsklndfsklndfskongskondfskodvnkodfvnkdfosnkodfsodvnkl/dfs"))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddAuthorization();
 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<AppDbContext>();
builder.Services.AddTransient<UseCaseExecutor>(x => new UseCaseExecutor(x));
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
    var accessor = x.GetRequiredService<IHttpContextAccessor>();
    var header = accessor.HttpContext.Request.Headers["Authorization"];

    var data = header.ToString().Split("Bearer ");

    if (data.Length < 2)
    {
        return new GuestActor();
        //throw new UnauthorizedAccessException();
    }

    var handler = new JwtSecurityTokenHandler();
    JwtSecurityToken tokenObj;
    try
    {
        tokenObj = handler.ReadJwtToken(data[1]);
    }
    catch
    {
         return new GuestActor();
    }

    var claims = tokenObj.Claims;
 

    var email = claims.First(x => x.Type == "Email").Value;
    var id = claims.First(x => x.Type == "Id").Value;
    var userRole = claims.FirstOrDefault(x => x.Type == "UserRole")?.Value ?? "0";

    return new JwtActor(id, email, userRole);
});

builder.Services.AddTransient<IRegisterCompany, EfRegisterCompany > ();

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
