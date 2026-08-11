interface HeroBannerSectionProps {
  canRequestHeroBanner: boolean;
  heroBannerStatus: string | null | undefined;
  onRequestClick: () => void;
}

export function HeroBannerSection({
  canRequestHeroBanner,
  heroBannerStatus,
  onRequestClick,
}: HeroBannerSectionProps) {
  return (
    <>
      {canRequestHeroBanner && (
        <button type="button" className="hero-banner-request-btn" onClick={onRequestClick}>
          <i className="fa-solid fa-star" /> Request hero banner placement
        </button>
      )}
      {heroBannerStatus === 'Pending' && (
        <div className="hero-banner-status pending">
          <i className="fa-solid fa-clock" /> Hero banner request pending admin approval
        </div>
      )}
      {heroBannerStatus === 'Approved' && (
        <div className="hero-banner-status approved">
          <i className="fa-solid fa-star" /> This listing is currently featured on the homepage
        </div>
      )}
    </>
  );
}
