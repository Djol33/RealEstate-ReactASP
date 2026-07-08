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

    public virtual DbSet<Checkbox> Checkboxes { get; set; }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<FieldsType> FieldsTypes { get; set; }

    public virtual DbSet<GeoMesto> GeoMesta { get; set; }

    public virtual DbSet<Header> Headers { get; set; }

    public virtual DbSet<HeatingRealestate> HeatingRealestates { get; set; }

    public virtual DbSet<HeatingType> HeatingTypes { get; set; }

    public virtual DbSet<Radio> Radios { get; set; }

    public virtual DbSet<Realestate> Realestates { get; set; }

    public virtual DbSet<RealestateImage> RealestateImages { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Support> Supports { get; set; }

    public virtual DbSet<Survey> Surveys { get; set; }

    public virtual DbSet<SurveyAnswer> SurveyAnswers { get; set; }

    public virtual DbSet<Text> Texts { get; set; }

    public virtual DbSet<TipObjektum> TipObjekta { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<User1> Users1 { get; set; }

    public virtual DbSet<UserBasic> UserBasics { get; set; }

    public virtual DbSet<Wishlist> Wishlists { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Checkbox>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_checkbox_id");

            entity.ToTable("checkbox", "phpapp");

            entity.HasIndex(e => e.Id, "id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IdSurvey).HasColumnName("id_survey");
            entity.Property(e => e.Value).HasColumnName("value");
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

        modelBuilder.Entity<FieldsType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_fields_type_id");

            entity.ToTable("fields_type", "phpapp");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Type)
                .HasMaxLength(10)
                .HasColumnName("type");
        });

        modelBuilder.Entity<GeoMesto>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__GeoMesta__3214EC076CF65B83");

            entity.Property(e => e.Naziv).HasMaxLength(200);
        });

        modelBuilder.Entity<Header>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_header_id");

            entity.ToTable("header", "phpapp");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.HrefLink)
                .HasMaxLength(25)
                .HasColumnName("href_link");
            entity.Property(e => e.Logged)
                .HasDefaultValueSql("(NULL)")
                .HasColumnName("logged");
            entity.Property(e => e.ParendId)
                .HasDefaultValueSql("(NULL)")
                .HasColumnName("parend_id");
            entity.Property(e => e.Role)
                .HasDefaultValueSql("(NULL)")
                .HasColumnName("role");
            entity.Property(e => e.Title)
                .HasMaxLength(75)
                .HasColumnName("title");
        });

        modelBuilder.Entity<HeatingRealestate>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("heating_realestate");

            entity.Property(e => e.IdHeating).HasColumnName("id_heating");
            entity.Property(e => e.IdRealestate).HasColumnName("id_realestate");

            entity.HasOne(d => d.IdHeatingNavigation).WithMany()
                .HasForeignKey(d => d.IdHeating)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_heating_realestate_heating_type");

            entity.HasOne(d => d.IdRealestateNavigation).WithMany()
                .HasForeignKey(d => d.IdRealestate)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_heating_realestate_realestate");
        });

        modelBuilder.Entity<HeatingType>(entity =>
        {
            entity.ToTable("heating_type");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.HeatingType1)
                .HasMaxLength(30)
                .HasColumnName("heating_type");
        });

        modelBuilder.Entity<Radio>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_radio_id");

            entity.ToTable("radio", "phpapp");

            entity.HasIndex(e => new { e.Id, e.IdSurvey }, "id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IdSurvey).HasColumnName("id_survey");
            entity.Property(e => e.Value).HasColumnName("value");
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

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_role_id");

            entity.ToTable("role", "phpapp");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(15)
                .HasColumnName("name");
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
        });

        modelBuilder.Entity<Survey>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_survey_id");

            entity.ToTable("survey", "phpapp");

            entity.HasIndex(e => e.FieldId, "field_id");

            entity.HasIndex(e => new { e.Id, e.FieldId }, "id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FieldId).HasColumnName("field_id");
            entity.Property(e => e.IsActive)
                .HasDefaultValue((short)1)
                .HasColumnName("is_active");
            entity.Property(e => e.Question).HasColumnName("question");
            entity.Property(e => e.Title).HasColumnName("title");

            entity.HasOne(d => d.Field).WithMany(p => p.Surveys)
                .HasForeignKey(d => d.FieldId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("survey$survey_ibfk_1");
        });

        modelBuilder.Entity<SurveyAnswer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_survey_answers_id");

            entity.ToTable("survey_answers", "phpapp");

            entity.HasIndex(e => new { e.UserId, e.SurveyId, e.Value }, "survey_answers$user_id").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SurveyId).HasColumnName("survey_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Value).HasColumnName("value");
        });

        modelBuilder.Entity<Text>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_text_id");

            entity.ToTable("text", "phpapp");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Value).HasColumnName("value");
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

        modelBuilder.Entity<User1>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.Role }).HasName("PK_users_user_id");

            entity.ToTable("users", "phpapp");

            entity.HasIndex(e => e.Role, "role");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.UserId)
                .ValueGeneratedOnAdd()
                .HasColumnName("user_id");
            entity.Property(e => e.Role)
                .HasDefaultValue((short)1)
                .HasColumnName("role");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.FName)
                .HasMaxLength(50)
                .HasColumnName("f_name");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.LName)
                .HasMaxLength(50)
                .HasColumnName("l_name");
            entity.Property(e => e.Password).HasColumnName("password");

            entity.HasOne(d => d.RoleNavigation).WithMany(p => p.User1s)
                .HasForeignKey(d => d.Role)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("users$users_ibfk_1");
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
