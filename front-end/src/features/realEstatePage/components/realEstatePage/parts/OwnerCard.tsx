import { Link, useNavigate } from 'react-router-dom';

interface OwnerCardProps {
  ownerId: number;
  fName: string;
  lName: string;
  email: string;
  logged: boolean;
  isOwnListing: boolean;
  reportSent: boolean;
  onReportClick: () => void;
}

export function OwnerCard({
  ownerId,
  fName,
  lName,
  email,
  logged,
  isOwnListing,
  reportSent,
  onReportClick,
}: OwnerCardProps) {
  const navigate = useNavigate();
  const initials = (fName?.[0] ?? '') + (lName?.[0] ?? '');

  return (
    <div id="owner">
      <div className="owner-identity">
        <span className="owner-avatar">{initials}</span>
        <div className="owner-text">
          <span className="owner-name">
            {logged ? (
              <Link to={`/user/${ownerId}`}>
                {fName} {lName}
              </Link>
            ) : (
              <span>{fName} {lName}</span>
            )}
          </span>
          {logged ? (
            <a className="owner-email" href={`mailto:${email}`}>{email}</a>
          ) : (
            <span className="owner-email">
              {email} &middot; <Link to="/auth/login">log in to see full contact info</Link>
            </span>
          )}
        </div>

        {logged && !isOwnListing && (
          <div className="owner-actions">
            <button
              type="button"
              className="icon-action"
              title="Send message"
              onClick={() => navigate(`/messages/${ownerId}`)}
            >
              <i className="fa-solid fa-envelope" />
            </button>
            {!reportSent && (
              <button
                type="button"
                className="icon-action danger"
                title="Report listing"
                onClick={onReportClick}
              >
                <i className="fa-solid fa-flag" />
              </button>
            )}
          </div>
        )}
      </div>

      {reportSent && (
        <span className="report-sent-note">
          <i className="fa-solid fa-check" /> Report sent, thank you
        </span>
      )}
    </div>
  );
}
