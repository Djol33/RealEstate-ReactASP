import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyHeroBannerRequests.scss';
import { formatPrice } from '../../../../shared/utils/format';
import { API_URL } from '../../../../config';

interface MyHeroRequest {
  id: number;
  realestateId: number;
  realestateTitle: string;
  days: number;
  totalPrice: number;
  status: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
}

const STATUS_LABEL: Record<number, string> = { 0: 'Pending', 1: 'Approved', 2: 'Rejected' };
const STATUS_CLASS: Record<number, string> = { 0: 'pending', 1: 'approved', 2: 'rejected' };

export function MyHeroBannerRequests() {
  const [requests, setRequests] = useState<MyHeroRequest[] | null>(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/hero-banner/my-requests`)
      .then((res) => setRequests(res.data))
      .catch(() => setRequests([]));
  }, []);

  if (requests === null || requests.length === 0) return null;

  return (
    <div className="my-hero-requests">
      <h2>Hero banner requests</h2>
      <div className="my-hero-requests-list">
        {requests.map((r) => {
          const isActive = r.status === 1 && r.endsAt && new Date(r.endsAt) > new Date();
          return (
            <div key={r.id} className="my-hero-requests-row">
              <Link to={`/realestate/${r.realestateId}`} className="listing-title">
                {r.realestateTitle}
              </Link>
              <span className="days">{r.days} days</span>
              <span className="price">€ {formatPrice(r.totalPrice)}</span>
              <span className={`status-badge ${STATUS_CLASS[r.status]}`}>
                {isActive ? 'Active' : STATUS_LABEL[r.status]}
              </span>
              {r.status === 1 && r.endsAt && (
                <span className="until">
                  {isActive ? 'until' : 'ended'} {new Date(r.endsAt).toLocaleDateString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
