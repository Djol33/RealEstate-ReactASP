import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminDashboard.scss';
import { formatPrice } from '../../../../shared/utils/format';
import { API_URL } from '../../../../config';

interface Stats {
  totalUsers: number;
  totalAdmins: number;
  totalRealEstate: number;
  totalMessages: number;
  totalViews: number;
  avgViewedArea: number;
  avgViewedPrice: number;
  soldLast24h: number;
  soldLast7Days: number;
  soldLast30Days: number;
  soldTotal: number;
  topCities: { cityName: string; count: number }[];
  mostViewed: any[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/admin/stats`)
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!stats) return <p>Failed to load statistics.</p>;

  const cards = [
    { label: 'Users', value: stats.totalUsers },
    { label: 'Admins', value: stats.totalAdmins },
    { label: 'Listings', value: stats.totalRealEstate },
    { label: 'Messages', value: stats.totalMessages },
    { label: 'Views', value: stats.totalViews },
    { label: 'Avg. viewed area', value: `${stats.avgViewedArea} m²` },
    { label: 'Avg. viewed price', value: `€ ${formatPrice(stats.avgViewedPrice)}` },
  ];

  const salesCards = [
    { label: 'Sold today', value: stats.soldLast24h },
    { label: 'Sold last 7 days', value: stats.soldLast7Days },
    { label: 'Sold last 30 days', value: stats.soldLast30Days },
    { label: 'Sold total', value: stats.soldTotal },
  ];

  return (
    <div className="admin-dashboard">
      <h1>Overview</h1>

      <div className="stat-cards">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <h2 className="dashboard-section-title">Sales</h2>
      <div className="stat-cards">
        {salesCards.map((c) => (
          <div key={c.label} className="stat-card sales">
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-cols">
        <section>
          <h2>Top cities</h2>
          {stats.topCities.length === 0 ? (
            <p className="muted">No data.</p>
          ) : (
            <ol className="top-list">
              {stats.topCities.map((c) => (
                <li key={c.cityName}>
                  <span>{c.cityName}</span>
                  <span className="count">{c.count}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section>
          <h2>Most viewed listings</h2>
          {stats.mostViewed.length === 0 ? (
            <p className="muted">No data.</p>
          ) : (
            <ul className="viewed-list">
              {stats.mostViewed.map((r) => (
                <li key={r.id}>
                  <Link to={`/realestate/${r.id}`}>{r.title}</Link>
                  <span className="muted">{r.cityName}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
