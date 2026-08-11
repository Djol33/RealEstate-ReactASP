import { ListRealEstate } from '../../../main/components/ListRealEstate/ListRealEstate';

interface ProfileListingsSectionProps {
  title: string;
  items: any[];
  error: boolean;
  errorMessage: string;
  onRetry: () => void;
  onItemDeleted: () => void;
}

export function ProfileListingsSection({
  title,
  items,
  error,
  errorMessage,
  onRetry,
  onItemDeleted,
}: ProfileListingsSectionProps) {
  return (
    <div className="profile-listings">
      <h2>{title}</h2>
      {error ? (
        <p className="profile-error">
          {errorMessage} <button type="button" onClick={onRetry}>Try again</button>
        </p>
      ) : (
        <ListRealEstate listResult={items} onItemDeleted={onItemDeleted} />
      )}
    </div>
  );
}
