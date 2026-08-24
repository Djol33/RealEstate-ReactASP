using Application;
using Application.Chat;
using Application.Command;
using Application.Command.Admin;
using Application.Email;
using Application.Exceptions;
using Application.HeroBanner;
using Application.Query;
using Application.Query.Admin;
using Application.Security;
using DataDomain.Entities;
using FluentValidation;
using FluentValidation.AspNetCore;
using Implementation.Command;
using Implementation.Command.Admin;
using Implementation.Query;
using Implementation.Query.Admin;
using Implementation.Query.Chat;
using Implementation.Query.City;
using Implementation.Query.RealEstate;
using Implementation.Query.Recommendations;
using Implementation.Query.TypeOfRealestate;
using Implementation.Query.User;
using Implementation.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using nekretnineapi;
using nekretnineapi.Auth;
using nekretnineapi.Hubs;
using nekretnineapi.Recommendations;
using nekretnineapi.Services;
using nekretnineapi.Json;
using nekretnineapi.Validators;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(
        path: Path.Combine(context.HostingEnvironment.ContentRootPath, "logs", "log-.txt"),
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"));
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173", "https://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
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
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new TrimmedStringConverter());
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
builder.Services.AddTransient<UseCaseExecutor>(x => new UseCaseExecutor(x));

builder.Services.AddSingleton<ITokenFactory, JwtTokenFactory>();
builder.Services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
builder.Services.AddTransient<ILogin, EfLogin>();
builder.Services.AddTransient<IShowRealEstate, EfShowRealEstate>();
builder.Services.AddTransient<ICitySearch, EfCity>();
builder.Services.AddTransient<IRegesiter, EfRegisterUser>();
builder.Services.AddTransient<IRegisterCompany, EfRegisterCompany>();
var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException(
        "Nedostaje connection string 'ConnectionStrings:Default'. Podesi ga u appsettings.json ili preko env varijable 'ConnectionStrings__Default'.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, x => x.UseNetTopologySuite()));
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
builder.Services.AddScoped<ImageStorageService>();
builder.Services.AddScoped<GeocodingService>();
builder.Services.AddScoped<IShowUserRealEstate, EfShowUserRealEstate>();
builder.Services.AddScoped<IEditProfile, EfEditProfile>();
builder.Services.AddScoped<IEditCompany, EfEditCompany>();
builder.Services.AddScoped<IToggleWishlist, EfToggleWishlist>();
builder.Services.AddScoped<IShowWishlist, EfShowWishlist>();
builder.Services.AddScoped<IDeleteRealestate, EfDeleteRealEstate>();
builder.Services.AddScoped<ISendMessage, EfSendMessage>();
builder.Services.AddScoped<IGetConversation, EfGetConversation>();
builder.Services.AddScoped<IGetConversations, EfGetConversations>();
builder.Services.AddScoped<IMarkRead, EfMarkRead>();

builder.Services.AddSignalR();
builder.Services.AddSingleton<IUserIdProvider, ClaimUserIdProvider>();
builder.Services.AddScoped<IChatNotifier, SignalRChatNotifier>();
builder.Services.AddScoped<ISendSystemMessage, EfSendSystemMessage>();

builder.Services.AddScoped<IViewerContext, ViewerContext>();
builder.Services.AddScoped<ITrackView, EfTrackView>();
builder.Services.AddScoped<ITrackViewDuration, EfTrackViewDuration>();
builder.Services.AddScoped<IGetRealestateAnalytics, EfGetRealestateAnalytics>();
builder.Services.AddScoped<IShowTrending, EfShowTrending>();
builder.Services.AddScoped<IShowRecentlyViewed, EfShowRecentlyViewed>();
builder.Services.AddScoped<IShowRecommendations, EfShowRecommendations>();
builder.Services.AddScoped<IAdminListUsers, EfAdminListUsers>();
builder.Services.AddScoped<IAdminStats, EfAdminStats>();
builder.Services.AddScoped<IAdminDeleteUser, EfAdminDeleteUser>();
builder.Services.AddScoped<IAdminSetRole, EfAdminSetRole>();
builder.Services.AddScoped<IAdminEditUser, EfAdminEditUser>();

var emailSettings = builder.Configuration.GetSection(EmailSettings.SectionName)
    .Get<EmailSettings>() ?? new EmailSettings();
builder.Services.AddSingleton(emailSettings);
builder.Services.AddSingleton<IEmailSender, SmtpEmailSender>();
var passwordResetSettings = builder.Configuration.GetSection(PasswordResetSettings.SectionName)
    .Get<PasswordResetSettings>() ?? new PasswordResetSettings();
builder.Services.AddSingleton(passwordResetSettings);
builder.Services.AddScoped<IRequestPasswordReset, EfRequestPasswordReset>();
builder.Services.AddScoped<IResetPassword, EfResetPassword>();
builder.Services.AddScoped<ICheckResetToken, Implementation.Query.Auth.EfCheckResetToken>();

var heroBannerSettings = builder.Configuration.GetSection(HeroBannerSettings.SectionName)
    .Get<HeroBannerSettings>() ?? new HeroBannerSettings();
builder.Services.AddSingleton(heroBannerSettings);
builder.Services.AddSingleton<IHeroBannerPricing>(heroBannerSettings);
builder.Services.AddScoped<IGetHeroBannerQuote, EfGetHeroBannerQuote>();
builder.Services.AddScoped<IGetActiveHeroBanners, EfGetActiveHeroBanners>();
builder.Services.AddScoped<IGetMyHeroBannerRequests, EfGetMyHeroBannerRequests>();
builder.Services.AddScoped<IRequestHeroBanner, EfRequestHeroBanner>();
builder.Services.AddScoped<IAdminListHeroBannerRequests, EfAdminListHeroBannerRequests>();
builder.Services.AddScoped<IAdminDecideHeroBanner, EfAdminDecideHeroBanner>();
builder.Services.AddScoped<IAdminRevokeHeroBanner, EfAdminRevokeHeroBanner>();
builder.Services.AddScoped<IReportRealestate, EfReportRealestate>();
builder.Services.AddScoped<IAdminListReports, EfAdminListReports>();
builder.Services.AddScoped<IAdminDecideReport, EfAdminDecideReport>();

builder.Services.AddScoped<IListAmenities, EfListAmenities>();
builder.Services.AddScoped<ISaveAmenity, EfSaveAmenity>();
builder.Services.AddScoped<IDeleteAmenity, EfDeleteAmenity>();
builder.Services.AddScoped<IRestoreAmenity, EfRestoreAmenity>();

builder.Services.AddScoped<IListContactReasons, EfListContactReasons>();
builder.Services.AddScoped<ISaveContactReason, EfSaveContactReason>();
builder.Services.AddScoped<IDeleteContactReason, EfDeleteContactReason>();
builder.Services.AddScoped<IRestoreContactReason, EfRestoreContactReason>();
builder.Services.AddScoped<ISubmitContactMessage, EfSubmitContactMessage>();
builder.Services.AddScoped<IAdminListContactMessages, EfAdminListContactMessages>();
builder.Services.AddScoped<IMarkContactMessageRead, EfMarkContactMessageRead>();
builder.Services.AddScoped<IReplyToContactMessage, EfReplyToContactMessage>();
builder.Services.AddScoped<ICloseContactMessage, EfCloseContactMessage>();

builder.Services.AddValidatorsFromAssemblyContaining<AddRealestateValidator>();

var app = builder.Build();

app.UseExceptionHandler(appError =>
{
    appError.Run(async context =>
    {
        var feature = context.Features.Get<IExceptionHandlerFeature>();
        var ex = feature?.Error;
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();

        var traceId = context.TraceIdentifier;
        var userId = context.User?.FindFirst("Id")?.Value ?? "anonymous";
        var method = context.Request.Method;
        var path = context.Request.Path + context.Request.QueryString;

        static string SafeMessage(Exception? e, string fallback)
        {
            if (e is null) return fallback;

            var isOurs =
                e is FluentValidation.ValidationException ||
                e is InvalidCredentialsException ||
                e is AccountDeactivatedException ||
                e is EmailDeliveryException;

            if (isOurs && !string.IsNullOrWhiteSpace(e.Message))
                return e.Message;

            var m = e.Message;
            if (string.IsNullOrWhiteSpace(m) || m.Length > 200) return fallback;

            string[] internalMarkers =
            {
                "Exception", "System.", "Microsoft.", "   at ", ":\\",
                "Object reference", "index was out of", "Sequence contains",
                "Value cannot be null", "SqlException", "was not found in the",
                "Unable to", "Could not load", "database", "connection"
            };

            foreach (var marker in internalMarkers)
            {
                if (m.Contains(marker, StringComparison.OrdinalIgnoreCase))
                    return fallback;
            }

            return m;
        }

        void LogHandled(LogLevel level, int statusCode) => logger.Log(
            level, ex,
            "Handled {ExceptionType} -> {StatusCode} on {Method} {Path} (user={UserId}, trace={TraceId})",
            ex?.GetType().Name, statusCode, method, path, userId, traceId);

        if (ex is FluentValidation.ValidationException validationEx)
        {
            LogHandled(LogLevel.Debug, 422);
            context.Response.StatusCode = 422;
            context.Response.ContentType = "application/json";
            var errors = validationEx.Errors.Select(e => new { property = e.PropertyName, error = e.ErrorMessage });
            await context.Response.WriteAsJsonAsync(new { errors });
            return;
        }

        if (ex is InvalidCredentialsException)
        {
            LogHandled(LogLevel.Information, 401);
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
            return;
        }

        if (ex is AccountDeactivatedException)
        {
            LogHandled(LogLevel.Information, 403);
            context.Response.StatusCode = 403;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
            return;
        }

        if (ex is EmailDeliveryException)
        {
            LogHandled(LogLevel.Error, 502);
            context.Response.StatusCode = 502;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
            return;
        }

        if (ex is UnauthorizedAccessException)
        {
            LogHandled(LogLevel.Warning, 403);
            context.Response.StatusCode = 403;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = SafeMessage(ex, "You do not have permission to perform this action."), traceId });
            return;
        }

        if (ex is KeyNotFoundException)
        {
            LogHandled(LogLevel.Information, 404);
            context.Response.StatusCode = 404;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = SafeMessage(ex, "The requested resource was not found."), traceId });
            return;
        }

        if (ex is ApplicationException)
        {
            LogHandled(LogLevel.Warning, 409);
            context.Response.StatusCode = 409;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = SafeMessage(ex, "Something went wrong. Please contact the administrator if the problem persists."), traceId });
            return;
        }

        logger.LogError(ex,
            "UNHANDLED {ExceptionType} on {Method} {Path} (user={UserId}, trace={TraceId})",
            ex?.GetType().FullName, method, path, userId, traceId);

        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = "Something went wrong. Please contact the administrator and include this reference.", traceId });
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
app.MapHub<ChatHub>("/hubs/chat");

try
{
    Log.Information("Starting nekretnineapi host");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
    throw;
}
finally
{
    Log.CloseAndFlush();
}
