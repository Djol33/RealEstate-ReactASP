import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../config';
import './RealEstateAnalyticsModal.scss';

interface DailyViewCount {
  date: string;
  count: number;
}

interface Analytics {
  totalViews: number;
  wishlistCount: number;
  averageDurationSeconds: number | null;
  viewsByDay: DailyViewCount[];
}

interface RealEstateAnalyticsModalProps {
  realestateId: number | string;
  onClose: () => void;
}

function formatDuration(seconds: number | null): string {
  if (seconds == null) return '-';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return `${minutes}m ${rest}s`;
}

export function RealEstateAnalyticsModal({ realestateId, onClose }: RealEstateAnalyticsModalProps) {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${API_URL}/api/RealEstateMain/${realestateId}/analytics`)
      .then((res) => setData(res.data))
      .catch(() => setError('Could not load analytics.'));
  }, [realestateId]);

  const maxCount = data ? Math.max(1, ...data.viewsByDay.map((d) => d.count)) : 1;

  return (
    <div className="analytics-modal-backdrop" onClick={onClose}>
      <div className="analytics-modal" onClick={(e) => e.stopPropagation()}>
        <div className="analytics-modal-header">
          <h2>Listing analytics</h2>
          <button type="button" className="analytics-modal-close" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {error && <p className="analytics-error">{error}</p>}

        {!error && !data && <p className="analytics-loading">Loading...</p>}

        {data && (
          <>
            <div className="analytics-stats">
              <div className="analytics-stat">
                <div className="analytics-stat-value">{data.totalViews}</div>
                <div className="analytics-stat-label">Total views</div>
              </div>
              <div className="analytics-stat">
                <div className="analytics-stat-value">{formatDuration(data.averageDurationSeconds)}</div>
                <div className="analytics-stat-label">Avg. time on page</div>
              </div>
              <div className="analytics-stat">
                <div className="analytics-stat-value">{data.wishlistCount}</div>
                <div className="analytics-stat-label">Saved by users</div>
              </div>
            </div>

            <h3>Views, last 14 days</h3>
            <div className="analytics-chart">
              {data.viewsByDay.map((d) => (
                <div className="analytics-bar-col" key={d.date}>
                  <div
                    className="analytics-bar"
                    style={{ height: `${(d.count / maxCount) * 100}%` }}
                    title={`${d.count} views`}
                  />
                  <span className="analytics-bar-label">
                    {new Date(d.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
