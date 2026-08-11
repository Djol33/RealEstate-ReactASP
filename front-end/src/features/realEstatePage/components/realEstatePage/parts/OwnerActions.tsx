import { useNavigate } from 'react-router-dom';
import { DeleteRealEstateButton } from '../../../../../shared/components/DeleteRealEstateButton';

interface OwnerActionsProps {
  realestateId: number;
  canEdit: boolean;
  canDelete: boolean;
  canViewAnalytics: boolean;
  onAnalyticsClick: () => void;
}

export function OwnerActions({
  realestateId,
  canEdit,
  canDelete,
  canViewAnalytics,
  onAnalyticsClick,
}: OwnerActionsProps) {
  const navigate = useNavigate();

  if (!canEdit && !canDelete) return null;

  return (
    <div id="holder_edit">
      {canEdit && (
        <button
          type="button"
          className="edit-btn"
          title="Edit"
          onClick={() => navigate(`/apartment/edit/${realestateId}`)}
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
    </div>
  );
}
