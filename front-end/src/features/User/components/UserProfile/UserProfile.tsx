import { useEffect, useState, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ProfileHero } from './ProfileHero';
import { ProfileListingsSection } from './ProfileListingsSection';
import { ProfileEditOverlay } from './ProfileEditOverlay';
import { MyHeroBannerRequests } from '../MyHeroBannerRequests/MyHeroBannerRequests';
import { SEO } from '../../../../shared/components/SEO/SEO';
import { useAuth } from '../../../../AuthStore';
import { API_URL } from '../../../../config';
import './UserProfile.scss';

export function UserProfile() {
  const { id } = useParams();
  const { user } = useAuth();

  const isSelfById = !!id && !!user && String(user.id) === String(id);
  const isOwnProfile = !id;

  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [listingsPage, setListingsPage] = useState(1);
  const [listingsTotalPages, setListingsTotalPages] = useState(1);
  const [listingsTotal, setListingsTotal] = useState(0);
  const [loadingMoreListings, setLoadingMoreListings] = useState(false);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [wishlistPage, setWishlistPage] = useState(1);
  const [wishlistTotalPages, setWishlistTotalPages] = useState(1);
  const [wishlistTotal, setWishlistTotal] = useState(0);
  const [loadingMoreWishlist, setLoadingMoreWishlist] = useState(false);
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

  const loadListings = useCallback((page = 1, append = false) => {
    const ownerId = isOwnProfile
      ? JSON.parse(localStorage.getItem('user') || '{}').id
      : id;
    if (!ownerId) return;
    if (append) setLoadingMoreListings(true);
    axios
      .get(`${API_URL}/api/Profile/${ownerId}/realestates`, { params: { page } })
      .then((r) => {
        setListingsError(false);
        setListings((prev) => (append ? [...prev, ...(r.data.data ?? [])] : r.data.data ?? []));
        setListingsPage(r.data.currentPage ?? page);
        setListingsTotalPages(r.data.totalPages ?? 1);
        setListingsTotal(r.data.totalCount ?? 0);
      })
      .catch(() => setListingsError(true))
      .finally(() => setLoadingMoreListings(false));
  }, [id, isOwnProfile]);

  const loadWishlist = useCallback((page = 1, append = false) => {
    if (!isOwnProfile) return;
    if (append) setLoadingMoreWishlist(true);
    axios
      .get(`${API_URL}/api/Wishlist`, { params: { page } })
      .then((r) => {
        setWishlistError(false);
        setWishlist((prev) => (append ? [...prev, ...(r.data.data ?? [])] : r.data.data ?? []));
        setWishlistPage(r.data.currentPage ?? page);
        setWishlistTotalPages(r.data.totalPages ?? 1);
        setWishlistTotal(r.data.totalCount ?? 0);
      })
      .catch(() => setWishlistError(true))
      .finally(() => setLoadingMoreWishlist(false));
  }, [isOwnProfile]);

  useEffect(() => {
    if (isSelfById) return;
    setLoading(true);

    axios.get(profileUrl).then((res) => {
      setProfile(res.data);
      loadListings();
      loadWishlist();
    }).catch((err) => {
      if (err.response?.status === 401) return;
      setProfile(null);
    }).finally(() => setLoading(false));
  }, [id, isOwnProfile, isSelfById]);

  if (isSelfById) return <Navigate to="/user/profile" replace />;

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

  const firstListingImage = listings.find(
    (l) => l?.images?.[0]?.location?.startsWith('images/')
  )?.images[0].location as string | undefined;

  const logoUrl = company?.logo?.startsWith('images/')
    ? `${API_URL}/${company.logo}`
    : company && firstListingImage
      ? `${API_URL}/${firstListingImage}`
      : null;

  return (
    <div id="profile">
      <SEO
        title={fullName}
        description={`${listingsTotal} listing${listingsTotal === 1 ? '' : 's'} by ${fullName} on Nekretnine.`}
      />

      <ProfileHero
        fullName={fullName}
        initials={initials}
        logoUrl={logoUrl}
        email={profile.email}
        bip={company?.bip}
        listingCount={listingsTotal}
        isOwnProfile={isOwnProfile}
        onEdit={() => setShowEdit(true)}
      />

      <ProfileListingsSection
        title="Listings"
        items={listings}
        error={listingsError}
        errorMessage="Could not load listings."
        onRetry={() => loadListings(1)}
        onItemDeleted={() => loadListings(1)}
        totalCount={listingsTotal}
        hasMore={listingsPage < listingsTotalPages}
        loadingMore={loadingMoreListings}
        onLoadMore={() => loadListings(listingsPage + 1, true)}
      />

      {isOwnProfile && (
        <ProfileListingsSection
          title="Saved"
          items={wishlist}
          error={wishlistError}
          errorMessage="Could not load saved listings."
          onRetry={() => loadWishlist(1)}
          onItemDeleted={() => loadWishlist(1)}
          totalCount={wishlistTotal}
          hasMore={wishlistPage < wishlistTotalPages}
          loadingMore={loadingMoreWishlist}
          onLoadMore={() => loadWishlist(wishlistPage + 1, true)}
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
