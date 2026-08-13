using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DataDomain.Entities;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }






    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Server=DESKTOP-F5TETT5;Database=phpapp;Trusted_Connection=True;TrustServerCertificate=True;", x => x.UseNetTopologySuite());
      
    }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<GeoMesto> GeoMesta { get; set; }

    public virtual DbSet<Realestate> Realestates { get; set; }

    public virtual DbSet<RealestateImage> RealestateImages { get; set; }

    public virtual DbSet<Support> Supports { get; set; }

    public virtual DbSet<ContactReason> ContactReasons { get; set; }

    public virtual DbSet<TipObjektum> TipObjekta { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserBasic> UserBasics { get; set; }

    public virtual DbSet<Wishlist> Wishlists { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<RealestateView> RealestateViews { get; set; }

    public virtual DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

    public virtual DbSet<HeroBannerRequest> HeroBannerRequests { get; set; }

    public virtual DbSet<RealestateReport> RealestateReports { get; set; }

    public virtual DbSet<Amenity> Amenities { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Amenity>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_amenity_id");

            entity.ToTable("amenity", "phpapp");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasMaxLength(50).HasColumnName("name");
            entity.Property(e => e.IsFilterable).HasColumnName("is_filterable");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");

            entity.HasMany(e => e.Realestates)
                .WithMany(r => r.Amenities)
                .UsingEntity(
                    "realestate_amenity",
                    l => l.HasOne(typeof(Realestate)).WithMany().HasForeignKey("realestate_id").HasPrincipalKey(nameof(Realestate.Id)),
                    r => r.HasOne(typeof(Amenity)).WithMany().HasForeignKey("amenity_id").HasPrincipalKey(nameof(Amenity.Id)),
                    j => j.ToTable("realestate_amenity", "phpapp"));
        });

        modelBuilder.Entity<RealestateReport>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_realestate_report_id");

            entity.ToTable("realestate_report", "phpapp");

            entity.HasIndex(e => e.Status, "IX_realestate_report_status");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RealestateId).HasColumnName("realestate_id");
            entity.Property(e => e.ReportedBy).HasColumnName("reported_by");
            entity.Property(e => e.Reason).HasMaxLength(50).HasColumnName("reason");
            entity.Property(e => e.Details).HasMaxLength(1000).HasColumnName("details");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
        });

        modelBuilder.Entity<HeroBannerRequest>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_hero_banner_request_id");

            entity.ToTable("hero_banner_request", "phpapp");

            entity.HasIndex(e => e.Status, "IX_hero_banner_request_status");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RealestateId).HasColumnName("realestate_id");
            entity.Property(e => e.RequestedBy).HasColumnName("requested_by");
            entity.Property(e => e.Days).HasColumnName("days");
            entity.Property(e => e.PricePerDay).HasColumnType("decimal(10, 2)").HasColumnName("price_per_day");
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(10, 2)").HasColumnName("total_price");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.StartsAt).HasColumnType("datetime").HasColumnName("starts_at");
            entity.Property(e => e.EndsAt).HasColumnType("datetime").HasColumnName("ends_at");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.RevokedAt).HasColumnType("datetime").HasColumnName("revoked_at");
        });

        modelBuilder.Entity<PasswordResetToken>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_password_reset_token_id");

            entity.ToTable("password_reset_token", "phpapp");

            entity.HasIndex(e => e.TokenHash, "IX_password_reset_token_hash");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.TokenHash).HasMaxLength(128).HasColumnName("token_hash");
            entity.Property(e => e.ExpiresAt).HasColumnType("datetime").HasColumnName("expires_at");
            entity.Property(e => e.UsedAt).HasColumnType("datetime").HasColumnName("used_at");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
        });

        modelBuilder.Entity<RealestateView>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_realestate_view_id");

            entity.ToTable("realestate_view", "phpapp");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ViewerKey).HasColumnName("viewer_key").HasMaxLength(64);
            entity.Property(e => e.RealestateId).HasColumnName("realestate_id");
            entity.Property(e => e.ViewedAt).HasColumnName("viewed_at");
            entity.Property(e => e.DurationSeconds).HasColumnName("duration_seconds");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_message_id");

            entity.ToTable("message", "phpapp");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SenderId).HasColumnName("sender_id");
            entity.Property(e => e.ReceiverId).HasColumnName("receiver_id");
            entity.Property(e => e.Content).HasColumnName("content").HasMaxLength(2000);
            entity.Property(e => e.SentAt).HasColumnName("sent_at");
            entity.Property(e => e.IsRead).HasColumnName("is_read");
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.Zip }).HasName("PK_city_id");

            entity.ToTable("city", "phpapp");

            entity.HasIndex(e => e.Id, "id");

            entity.HasIndex(e => new { e.Id, e.Zip }, "id_2");

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("id");
            entity.Property(e => e.Zip).HasColumnName("zip");
            entity.Property(e => e.City1)
                .HasMaxLength(25)
                .HasColumnName("city");
            entity.Property(e => e.Lat)
                .HasColumnType("decimal(9, 6)")
                .HasColumnName("lat");
            entity.Property(e => e.Lng)
                .HasColumnType("decimal(9, 6)")
                .HasColumnName("lng");
            entity.Property(e => e.Opstina).HasColumnName("opstina");
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_company_id");

            entity.ToTable("company", "phpapp");

            entity.HasIndex(e => e.FkId, "fk_id");

            entity.HasIndex(e => e.Bip, "UX_company_bip").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Bip)
                .HasMaxLength(20)
                .HasColumnName("BIP");
            entity.Property(e => e.FkId).HasColumnName("fk_id");
            entity.Property(e => e.Location)
                .HasMaxLength(40)
                .HasColumnName("location");
            entity.Property(e => e.Logo)
                .HasMaxLength(250)
                .HasColumnName("logo");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");

            entity.HasOne(d => d.Fk).WithMany(p => p.Companies)
                .HasForeignKey(d => d.FkId)
                .HasConstraintName("FK_company_user");
        });

        modelBuilder.Entity<GeoMesto>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__GeoMesta__3214EC076CF65B83");

            entity.Property(e => e.Naziv).HasMaxLength(200);
        });

        modelBuilder.Entity<Realestate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_realestate_id");

            entity.ToTable("realestate", "phpapp");

            entity.HasIndex(e => e.City, "city");

            entity.HasIndex(e => e.Id, "id");

            entity.HasIndex(e => new { e.Id, e.City, e.TypeObject, e.Owner }, "id_2");

            entity.HasIndex(e => e.Owner, "owner");

            entity.HasIndex(e => e.TypeObject, "typeObject");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Adress).HasColumnName("adress");
            entity.Property(e => e.Area).HasColumnName("area");
            entity.Property(e => e.City).HasColumnName("city");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(1)
                .HasColumnName("is_active");
            entity.Property(e => e.NumberOfRooms).HasColumnName("numberOfRooms");
            entity.Property(e => e.Owner).HasColumnName("owner");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(10, 0)")
                .HasColumnName("price");
            entity.Property(e => e.Terrace).HasColumnName("terrace");
            entity.Property(e => e.Registered).HasColumnName("registered");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.TypeObject).HasColumnName("typeObject");
            entity.Property(e => e.Lat).HasColumnType("decimal(9, 6)").HasColumnName("lat");
            entity.Property(e => e.Lng).HasColumnType("decimal(9, 6)").HasColumnName("lng");

            entity.HasOne(d => d.TypeObjectNavigation).WithMany(p => p.Realestates)
                .HasForeignKey(d => d.TypeObject)
                .HasConstraintName("realestate$realestate_ibfk_1");
        });

        modelBuilder.Entity<RealestateImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_realestate_image_id");

            entity.ToTable("realestate_image", "phpapp");

            entity.HasIndex(e => e.IdPost, "id_post");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Alt)
                .HasMaxLength(50)
                .HasColumnName("alt");
            entity.Property(e => e.IdPost).HasColumnName("id_post");
            entity.Property(e => e.Location).HasColumnName("location");

            entity.HasOne(d => d.IdPostNavigation).WithMany(p => p.RealestateImages)
                .HasForeignKey(d => d.IdPost)
                .HasConstraintName("realestate_image$realestate_image_ibfk_1");
        });

        modelBuilder.Entity<Support>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_support_id");

            entity.ToTable("support", "phpapp");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.DateReported)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("date_reported");
            entity.Property(e => e.Email)
                .HasDefaultValueSql("(NULL)")
                .HasColumnName("email");
            entity.Property(e => e.FName)
                .HasMaxLength(50)
                .HasDefaultValueSql("(NULL)")
                .HasColumnName("f_name");
            entity.Property(e => e.IdUser)
                .HasDefaultValueSql("(NULL)")
                .HasColumnName("id_user");
            entity.Property(e => e.IsRead).HasColumnName("is_read");
            entity.Property(e => e.LName)
                .HasMaxLength(50)
                .HasDefaultValueSql("(NULL)")
                .HasColumnName("l_name");
            entity.Property(e => e.Title)
                .HasMaxLength(30)
                .HasColumnName("title");
            entity.Property(e => e.ReasonId).HasColumnName("reason_id");

            entity.HasOne(d => d.ReasonNavigation).WithMany(p => p.Supports)
                .HasForeignKey(d => d.ReasonId)
                .HasConstraintName("FK_support_reason");
        });

        modelBuilder.Entity<ContactReason>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_contact_reason_id");

            entity.ToTable("contact_reason", "phpapp");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasMaxLength(80).HasColumnName("name");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
        });

        modelBuilder.Entity<TipObjektum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_tip_objekta_id");

            entity.ToTable("tip_objekta", "phpapp");

            entity.HasIndex(e => e.Id, "id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Naziv).HasColumnName("naziv");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_user_id");

            entity.ToTable("user", "phpapp");

            entity.HasIndex(e => e.Email, "emailUnique").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.Password)
                .HasMaxLength(500)
                .HasColumnName("password");
            entity.Property(e => e.UserRole).HasColumnName("user_role");
            entity.Property(e => e.UserType).HasColumnName("user_type");
        });

        modelBuilder.Entity<UserBasic>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_user_basic_id");

            entity.ToTable("user_basic", "phpapp");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FirstName)
                .HasMaxLength(30)
                .HasColumnName("first_name");
            entity.Property(e => e.FkId).HasColumnName("fk_id");
            entity.Property(e => e.LastName)
                .HasMaxLength(30)
                .HasColumnName("last_name");
            entity.Property(e => e.Address)
                .HasMaxLength(200)
                .HasColumnName("address");

            entity.HasOne(d => d.Fk).WithMany(p => p.UserBasics)
                .HasForeignKey(d => d.FkId)
                .HasConstraintName("FK_user_basic_user");
        });

        modelBuilder.Entity<Wishlist>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.RealestateId }).HasName("PK_wishlist_user_id");

            entity.ToTable("wishlist", "phpapp");

            entity.HasIndex(e => e.RealestateId, "realestate_id");

            entity.HasIndex(e => new { e.UserId, e.RealestateId }, "user_id_2");

            entity.HasIndex(e => new { e.UserId, e.RealestateId }, "wishlist$user_id").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.RealestateId).HasColumnName("realestate_id");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .HasDefaultValueSql("(0x01)")
                .IsFixedLength()
                .HasColumnName("is_active");

            entity.HasOne(d => d.Realestate).WithMany(p => p.Wishlists)
                .HasForeignKey(d => d.RealestateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("wishlist$wishlist_ibfk_2");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
