import { useNavigate } from 'react-router-dom';
import { DeleteRealEstateButton } from '../../../../../shared/components/DeleteRealEstateButton';

interface OwnerActionsProps {
  realestateId: number;
  canEdit: boolean;
  canDelete: boolean;
  canViewAnalytics: boolean;
  canRequestHeroBanner: boolean;
  heroBannerStatus: string | null | undefined;
  onAnalyticsClick: () => void;
  onHeroBannerClick: () => void;
}

export function OwnerActions({
  realestateId,
  canEdit,
  canDelete,
  canViewAnalytics,
  canRequestHeroBanner,
  heroBannerStatus,
  onAnalyticsClick,
  onHeroBannerClick,
}: OwnerActionsProps) {
  const navigate = useNavigate();

  const isPending = heroBannerStatus === 'Pending';
  const isApproved = heroBannerStatus === 'Approved';
  const showHeroBanner = canRequestHeroBanner || isPending || isApproved;

  const heroTitle = isApproved
    ? 'Featured on the homepage'
    : isPending
      ? 'Hero banner request pending approval'
      : 'Request hero banner placement';

  if (!canEdit && !canDelete && !showHeroBanner) return null;

  return (
    <div id="holder_edit">
      {canEdit && (
        <button
          type="button"
          className="edit-btn"
          title="Edit"
          onClick={() => navigate(`/realestate/${realestateId}/edit`)}
        >
          <i className="fa-solid fa-pencil" />
        </button>
      )}
      <DeleteRealEstateButton
        realestateId={realestateId}
        canDelete={canDelete}
        onDeleted={() => navigate('/')}
      />
      {canViewAnalytics && (
        <button
          type="button"
          className="analytics-btn"
          title="View analytics"
          onClick={onAnalyticsClick}
        >
          <i className="fa-solid fa-chart-line" />
        </button>
      )}
      {showHeroBanner && (
        <button
          type="button"
          className={`hero-btn${isApproved ? ' approved' : ''}${isPending ? ' pending' : ''}`}
          title={heroTitle}
          aria-label={heroTitle}
          disabled={isPending || isApproved}
          onClick={onHeroBannerClick}
        >
          <i className={isPending ? 'fa-solid fa-clock' : 'fa-solid fa-star'} />
        </button>
      )}
    </div>
  );
}
