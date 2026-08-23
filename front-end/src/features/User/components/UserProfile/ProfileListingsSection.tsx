import { ListRealEstate } from '../../../main/components/ListRealEstate/ListRealEstate';

interface ProfileListingsSectionProps {
  title: string;
  items: any[];
  error: boolean;
  errorMessage: string;
  onRetry: () => void;
  onItemDeleted: () => void;
  totalCount?: number;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export function ProfileListingsSection({
  title,
  items,
  error,
  errorMessage,
  onRetry,
  onItemDeleted,
  totalCount,
  hasMore,
  loadingMore,
  onLoadMore,
}: ProfileListingsSectionProps) {
  return (
    <div className="profile-listings">
      <h2>
        {title}
        {typeof totalCount === 'number' && totalCount > 0 ? ` (${totalCount})` : ''}
      </h2>
      {error ? (
        <p className="profile-error">
          {errorMessage} <button type="button" onClick={onRetry}>Try again</button>
        </p>
      ) : (
        <>
          <ListRealEstate listResult={items} onItemDeleted={onItemDeleted} />

          {hasMore && onLoadMore && (
            <div className="profile-load-more">
              <button type="button" onClick={onLoadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
