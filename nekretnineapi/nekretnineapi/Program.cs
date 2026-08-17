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
using System.Text;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});
builder.Services.AddHttpContextAccessor();

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

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/chat"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireClaim("UserRole", UserRoles.Admin.ToString()));
});

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
builder.Services.AddScoped<nekretnineapi.Services.ImageStorageService>();
builder.Services.AddScoped<nekretnineapi.Services.GeocodingService>();
builder.Services.AddScoped<IShowUserRealEstate, Implementation.Query.RealEstate.EfShowUserRealEstate>();
builder.Services.AddScoped<IEditProfile, Implementation.Command.EfEditProfile>();
builder.Services.AddScoped<IEditCompany, Implementation.Command.EfEditCompany>();
builder.Services.AddScoped<IToggleWishlist, Implementation.Command.EfToggleWishlist>();
builder.Services.AddScoped<IShowWishlist, Implementation.Query.RealEstate.EfShowWishlist>();
builder.Services.AddScoped<IDeleteRealestate, Implementation.Command.EfDeleteRealEstate>();
builder.Services.AddScoped<ISendMessage, Implementation.Command.EfSendMessage>();
builder.Services.AddScoped<IGetConversation, Implementation.Query.Chat.EfGetConversation>();
builder.Services.AddScoped<IGetConversations, Implementation.Query.Chat.EfGetConversations>();
builder.Services.AddScoped<IMarkRead, Implementation.Command.EfMarkRead>();

builder.Services.AddSignalR();
builder.Services.AddSingleton<Microsoft.AspNetCore.SignalR.IUserIdProvider, nekretnineapi.Auth.ClaimUserIdProvider>();
builder.Services.AddScoped<Application.Chat.IChatNotifier, nekretnineapi.Hubs.SignalRChatNotifier>();
builder.Services.AddScoped<Application.Command.ISendSystemMessage, Implementation.Command.EfSendSystemMessage>();

builder.Services.AddScoped<Application.IViewerContext, nekretnineapi.Recommendations.ViewerContext>();
builder.Services.AddScoped<ITrackView, Implementation.Command.EfTrackView>();
builder.Services.AddScoped<Application.Command.ITrackViewDuration, Implementation.Command.EfTrackViewDuration>();
builder.Services.AddScoped<Application.Query.IGetRealestateAnalytics, Implementation.Query.EfGetRealestateAnalytics>();
builder.Services.AddScoped<IShowTrending, Implementation.Query.Recommendations.EfShowTrending>();
builder.Services.AddScoped<IShowRecentlyViewed, Implementation.Query.Recommendations.EfShowRecentlyViewed>();
builder.Services.AddScoped<IShowRecommendations, Implementation.Query.Recommendations.EfShowRecommendations>();
builder.Services.AddScoped<Application.Query.Admin.IAdminListUsers, Implementation.Query.Admin.EfAdminListUsers>();
builder.Services.AddScoped<Application.Query.Admin.IAdminStats, Implementation.Query.Admin.EfAdminStats>();
builder.Services.AddScoped<Application.Command.Admin.IAdminDeleteUser, Implementation.Command.Admin.EfAdminDeleteUser>();
builder.Services.AddScoped<Application.Command.Admin.IAdminSetRole, Implementation.Command.Admin.EfAdminSetRole>();
builder.Services.AddScoped<Application.Command.Admin.IAdminEditUser, Implementation.Command.Admin.EfAdminEditUser>();

var emailSettings = builder.Configuration.GetSection(nekretnineapi.Services.EmailSettings.SectionName)
    .Get<nekretnineapi.Services.EmailSettings>() ?? new nekretnineapi.Services.EmailSettings();
builder.Services.AddSingleton(emailSettings);
builder.Services.AddSingleton<Application.Email.IEmailSender, nekretnineapi.Services.SmtpEmailSender>();
var passwordResetSettings = builder.Configuration.GetSection(Application.Security.PasswordResetSettings.SectionName)
    .Get<Application.Security.PasswordResetSettings>() ?? new Application.Security.PasswordResetSettings();
builder.Services.AddSingleton(passwordResetSettings);
builder.Services.AddScoped<Application.Command.IRequestPasswordReset, Implementation.Command.EfRequestPasswordReset>();
builder.Services.AddScoped<Application.Command.IResetPassword, Implementation.Command.EfResetPassword>();

var heroBannerSettings = builder.Configuration.GetSection(nekretnineapi.Services.HeroBannerSettings.SectionName)
    .Get<nekretnineapi.Services.HeroBannerSettings>() ?? new nekretnineapi.Services.HeroBannerSettings();
builder.Services.AddSingleton(heroBannerSettings);
builder.Services.AddSingleton<Application.HeroBanner.IHeroBannerPricing>(heroBannerSettings);
builder.Services.AddScoped<Application.Query.IGetHeroBannerQuote, Implementation.Query.EfGetHeroBannerQuote>();
builder.Services.AddScoped<Application.Query.IGetActiveHeroBanners, Implementation.Query.EfGetActiveHeroBanners>();
builder.Services.AddScoped<Application.Query.IGetMyHeroBannerRequests, Implementation.Query.EfGetMyHeroBannerRequests>();
builder.Services.AddScoped<Application.Command.IRequestHeroBanner, Implementation.Command.EfRequestHeroBanner>();
builder.Services.AddScoped<Application.Query.Admin.IAdminListHeroBannerRequests, Implementation.Query.Admin.EfAdminListHeroBannerRequests>();
builder.Services.AddScoped<Application.Command.Admin.IAdminDecideHeroBanner, Implementation.Command.Admin.EfAdminDecideHeroBanner>();
builder.Services.AddScoped<Application.Command.Admin.IAdminRevokeHeroBanner, Implementation.Command.Admin.EfAdminRevokeHeroBanner>();
builder.Services.AddScoped<Application.Command.IReportRealestate, Implementation.Command.EfReportRealestate>();
builder.Services.AddScoped<Application.Query.Admin.IAdminListReports, Implementation.Query.Admin.EfAdminListReports>();
builder.Services.AddScoped<Application.Command.Admin.IAdminDecideReport, Implementation.Command.Admin.EfAdminDecideReport>();

builder.Services.AddScoped<Application.Query.IListAmenities, Implementation.Query.EfListAmenities>();
builder.Services.AddScoped<Application.Command.Admin.ISaveAmenity, Implementation.Command.Admin.EfSaveAmenity>();
builder.Services.AddScoped<Application.Command.Admin.IDeleteAmenity, Implementation.Command.Admin.EfDeleteAmenity>();
builder.Services.AddScoped<Application.Command.Admin.IRestoreAmenity, Implementation.Command.Admin.EfRestoreAmenity>();

builder.Services.AddScoped<Application.Query.IListContactReasons, Implementation.Query.EfListContactReasons>();
builder.Services.AddScoped<Application.Command.Admin.ISaveContactReason, Implementation.Command.Admin.EfSaveContactReason>();
builder.Services.AddScoped<Application.Command.Admin.IDeleteContactReason, Implementation.Command.Admin.EfDeleteContactReason>();
builder.Services.AddScoped<Application.Command.ISubmitContactMessage, Implementation.Command.EfSubmitContactMessage>();
builder.Services.AddScoped<Application.Query.Admin.IAdminListContactMessages, Implementation.Query.Admin.EfAdminListContactMessages>();
builder.Services.AddScoped<Application.Command.Admin.IMarkContactMessageRead, Implementation.Command.Admin.EfMarkContactMessageRead>();
builder.Services.AddScoped<Application.Command.Admin.IReplyToContactMessage, Implementation.Command.Admin.EfReplyToContactMessage>();

builder.Services.AddValidatorsFromAssemblyContaining<AddRealestateValidator>();

var app = builder.Build();

app.UseExceptionHandler(appError =>
{
    appError.Run(async context =>
    {
        var feature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        var ex = feature?.Error;
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();

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

        if (ex is AccountDeactivatedException)
        {
            context.Response.StatusCode = 403;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
            return;
        }

        if (ex is EmailDeliveryException)
        {
            context.Response.StatusCode = 502;
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

        if (ex is ApplicationException)
        {
            context.Response.StatusCode = 409;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
            return;
        }

        logger.LogError(ex, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);

        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = "A server error occurred." });
    });
});


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

app.Use(async (context, next) =>
{
    if (context.User?.Identity is { IsAuthenticated: true } &&
        int.TryParse(context.User.FindFirst("Id")?.Value, out var userId))
    {
        var db = context.RequestServices.GetRequiredService<AppDbContext>();
        var current = await db.Users
            .Where(u => u.Id == userId)
            .Select(u => new { u.IsActive, u.UserRole })
            .FirstOrDefaultAsync();

        if (current == null || current.IsActive != 1)
        {
            context.Response.StatusCode = 403;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = "This account has been deactivated." });
            return;
        }

        var tokenRole = context.User.FindFirst("UserRole")?.Value;
        if (tokenRole != current.UserRole.ToString())
        {
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = "Your permissions have changed. Please log in again." });
            return;
        }
    }

    await next();
});

app.UseAuthorization();

app.MapControllers();
app.MapHub<nekretnineapi.Hubs.ChatHub>("/hubs/chat");
app.Run();
