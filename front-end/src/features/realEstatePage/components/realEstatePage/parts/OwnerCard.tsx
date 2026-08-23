import { Link, useNavigate } from 'react-router-dom';

interface OwnerCardProps {
  ownerId: number;
  fName: string;
  lName: string;
  email: string;
  avatarUrl?: string | null;
  logged: boolean;
  isOwnListing: boolean;
  canReport: boolean;
  reportSent: boolean;
  onReportClick: () => void;
}

export function OwnerCard({
  ownerId,
  fName,
  lName,
  email,
  avatarUrl,
  logged,
  isOwnListing,
  canReport,
  reportSent,
  onReportClick,
}: OwnerCardProps) {
  const navigate = useNavigate();
  const initials = (fName?.[0] ?? '') + (lName?.[0] ?? '');

  return (
    <div id="owner">
      <div className="owner-identity">
        {avatarUrl ? (
          <span className="owner-avatar owner-avatar-image">
            <img src={avatarUrl} alt={`${fName} ${lName}`.trim()} />
          </span>
        ) : (
          <span className="owner-avatar">{initials}</span>
        )}
        <div className="owner-text">
          <span className="owner-name">
            {logged ? (
              <Link to={isOwnListing ? '/user/profile' : `/user/${ownerId}`}>
                {fName} {lName}
              </Link>
            ) : (
              <span>{fName} {lName}</span>
            )}
          </span><span>
          {logged ? (
            <a className="owner-email-link" href={`mailto:${email}`}>{email}</a>
          ) : (
            <span className="owner-email-hidden">
              {email} &middot; <Link to="/auth/login" className="login-link">log in to see full contact info</Link>
            </span>
          )}</span>
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
            {canReport && !reportSent && (
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

      {canReport && reportSent && (
        <span className="report-sent-note">
          <i className="fa-solid fa-check" /> Report sent, thank you
        </span>
      )}
    </div>
  );
}
