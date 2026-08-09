import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Overlay } from '../../../../shared/components/Overlay/Overlay';
import { ListRealEstate } from '../../../main/components/ListRealEstate/ListRealEstate';
import { EditProfileForm } from '../EditProfileForm';
import { EditCompanyForm } from '../EditCompanyForm/EditCompanyForm';
import { MyHeroBannerRequests } from '../MyHeroBannerRequests/MyHeroBannerRequests';
import { SEO } from '../../../../shared/components/SEO/SEO';
import './UserProfile.css';

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
    ? 'https://localhost:7154/api/Profile'
    : `https://localhost:7154/api/Profile/${id}`;

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
      .get(`https://localhost:7154/api/Profile/${ownerId}/realestates`)
      .then((r) => {
        setListingsError(false);
        setListings(r.data);
      })
      .catch(() => setListingsError(true));
  }, [id, isOwnProfile]);

  const loadWishlist = useCallback(() => {
    if (!isOwnProfile) return;
    axios
      .get('https://localhost:7154/api/Wishlist')
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
    ? `https://localhost:7154/${company.logo}`
    : null;

  return (
    <div id="profile">
      <SEO
        title={fullName}
        description={`${listings.length} listing${listings.length === 1 ? '' : 's'} by ${fullName} on Nekretnine.`}
      />
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
          <p className="profile-email">{profile.email}</p>
          {company?.bip && <p className="profile-bip">Tax ID: {company.bip}</p>}
          <span className="profile-count">
            {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
          </span>
        </div>

        {isOwnProfile && (
          <button className="edit-profile-btn" onClick={() => setShowEdit(true)}>
            Edit profile
          </button>
        )}
      </div>

      <div className="profile-listings">
        <h2>Listings</h2>
        {listingsError ? (
          <p className="profile-error">
            Could not load listings. <button type="button" onClick={loadListings}>Try again</button>
          </p>
        ) : (
          <ListRealEstate listResult={listings} onItemDeleted={loadListings} />
        )}
      </div>

      {isOwnProfile && (
        <div className="profile-listings">
          <h2>Saved</h2>
          {wishlistError ? (
            <p className="profile-error">
              Could not load saved listings. <button type="button" onClick={loadWishlist}>Try again</button>
            </p>
          ) : (
            <ListRealEstate listResult={wishlist} onItemDeleted={loadWishlist} />
          )}
        </div>
      )}

      {isOwnProfile && company && <MyHeroBannerRequests />}

      {isOwnProfile && basic && (
        <Overlay isVisible={showEdit} changeVisibility={setShowEdit}>
          <EditProfileForm
            initialData={{ firstName: basic.firstName, lastName: basic.lastName }}
            onSaved={() => {
              setShowEdit(false);
              loadProfile();
            }}
            onCancel={() => setShowEdit(false)}
          />
        </Overlay>
      )}

      {isOwnProfile && company && (
        <Overlay isVisible={showEdit} changeVisibility={setShowEdit}>
          <EditCompanyForm
            initialData={{ name: company.name, bip: company.bip, logo: company.logo }}
            onSaved={() => {
              setShowEdit(false);
              loadProfile();
            }}
            onCancel={() => setShowEdit(false)}
          />
        </Overlay>
      )}
    </div>
  );
}
