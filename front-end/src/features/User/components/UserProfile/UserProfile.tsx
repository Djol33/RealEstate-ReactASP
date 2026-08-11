import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ProfileHero } from './ProfileHero';
import { ProfileListingsSection } from './ProfileListingsSection';
import { ProfileEditOverlay } from './ProfileEditOverlay';
import { MyHeroBannerRequests } from '../MyHeroBannerRequests/MyHeroBannerRequests';
import { SEO } from '../../../../shared/components/SEO/SEO';
import { API_URL } from '../../../../config';
import './UserProfile.scss';

export function UserProfile() {
  const { id } = useParams();
  const isOwnProfile = !id;

  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listingsError, setListingsError] = useState(false);
  const [wishlistError, setWishlistError] = useState(false);

  const profileUrl = isOwnProfile
    ? `${API_URL}/api/Profile`
    : `${API_URL}/api/Profile/${id}`;

  const loadProfile = useCallback(async () => {
    const res = await axios.get(profileUrl);
    setProfile(res.data);
  }, [profileUrl]);

  const loadListings = useCallback(() => {
    const ownerId = isOwnProfile
      ? JSON.parse(localStorage.getItem('user') || '{}').id
      : id;
    if (!ownerId) return;
    axios
      .get(`${API_URL}/api/Profile/${ownerId}/realestates`)
      .then((r) => {
        setListingsError(false);
        setListings(r.data);
      })
      .catch(() => setListingsError(true));
  }, [id, isOwnProfile]);

  const loadWishlist = useCallback(() => {
    if (!isOwnProfile) return;
    axios
      .get(`${API_URL}/api/Wishlist`)
      .then((r) => {
        setWishlistError(false);
        setWishlist(r.data);
      })
      .catch(() => setWishlistError(true));
  }, [isOwnProfile]);

  useEffect(() => {
    setLoading(true);

    axios.get(profileUrl).then((res) => {
      setProfile(res.data);
      loadListings();
      loadWishlist();
    }).catch((err) => {
      if (err.response?.status === 401) return;
      setProfile(null);
    }).finally(() => setLoading(false));
  }, [id, isOwnProfile]);

  if (loading) return <div id="profile"><p>Loading...</p></div>;
  if (!profile) return <div id="profile"><p>Profile not found.</p></div>;

  const basic = profile.userBasic;
  const company = profile.userCompany;

  const fullName = company?.name
    ? company.name
    : basic
      ? `${basic.firstName} ${basic.lastName}`
      : profile.email;

  const initials = company?.name
    ? company.name[0].toUpperCase()
    : basic
      ? `${basic.firstName?.[0] ?? ''}${basic.lastName?.[0] ?? ''}`.toUpperCase()
      : profile.email?.[0]?.toUpperCase() ?? '?';

  const logoUrl = company?.logo?.startsWith('images/')
    ? `${API_URL}/${company.logo}`
    : null;

  return (
    <div id="profile">
      <SEO
        title={fullName}
        description={`${listings.length} listing${listings.length === 1 ? '' : 's'} by ${fullName} on Nekretnine.`}
      />

      <ProfileHero
        fullName={fullName}
        initials={initials}
        logoUrl={logoUrl}
        email={profile.email}
        bip={company?.bip}
        listingCount={listings.length}
        isOwnProfile={isOwnProfile}
        onEdit={() => setShowEdit(true)}
      />

      <ProfileListingsSection
        title="Listings"
        items={listings}
        error={listingsError}
        errorMessage="Could not load listings."
        onRetry={loadListings}
        onItemDeleted={loadListings}
      />

      {isOwnProfile && (
        <ProfileListingsSection
          title="Saved"
          items={wishlist}
          error={wishlistError}
          errorMessage="Could not load saved listings."
          onRetry={loadWishlist}
          onItemDeleted={loadWishlist}
        />
      )}

      {isOwnProfile && company && <MyHeroBannerRequests />}

      {isOwnProfile && (basic || company) && (
        <ProfileEditOverlay
          isVisible={showEdit}
          onClose={setShowEdit}
          basic={basic}
          company={company}
          onSaved={() => {
            setShowEdit(false);
            loadProfile();
          }}
        />
      )}
    </div>
  );
}
