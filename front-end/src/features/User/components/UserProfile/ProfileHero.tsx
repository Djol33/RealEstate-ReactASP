interface ProfileHeroProps {
  fullName: string;
  initials: string;
  logoUrl: string | null;
  email: string;
  bip?: string | null;
  listingCount: number;
  isOwnProfile: boolean;
  onEdit: () => void;
}

export function ProfileHero({
  fullName,
  initials,
  logoUrl,
  email,
  bip,
  listingCount,
  isOwnProfile,
  onEdit,
}: ProfileHeroProps) {
  return (
    <div className="profile-hero">
      {logoUrl ? (
        <div className="profile-avatar profile-logo">
          <img src={logoUrl} alt={fullName} />
        </div>
      ) : (
        <div className="profile-avatar">{initials}</div>
      )}

      <div className="profile-info">
        <h1>{fullName}</h1>
        <p className="profile-email">{email}</p>
        {bip && <p className="profile-bip">Tax ID: {bip}</p>}
        <span className="profile-count">
          {listingCount} {listingCount === 1 ? 'listing' : 'listings'}
        </span>
      </div>

      {isOwnProfile && (
        <button className="edit-profile-btn" onClick={onEdit}>
          Edit profile
        </button>
      )}
    </div>
  );
}
