import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RecommendationShelf.scss';

interface RecommendationShelfProps {
  title: string;
  endpoint: string;
  count?: number;
}

export function RecommendationShelf({ title, endpoint, count = 8 }: RecommendationShelfProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(`https://localhost:7154${endpoint}?count=${count}`)
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoaded(true));
  }, [endpoint, count]);

  if (!loaded || items.length === 0) return null;

  return (
    <section className="rec-shelf">
      <h2 className="rec-shelf-title">{title}</h2>
      <div className="rec-shelf-row">
        {items.map((item) => (
          <Link key={item.id} to={`/realestate/${item.id}`} className="rec-card">
            <div
              className="rec-card-img"
              style={{
                backgroundImage: `url(${
                  item.images?.[0]?.location
                    ? 'https://localhost:7154/' + item.images[0].location
                    : 'https://placehold.co/300x200?text=No+Image'
                })`,
              }}
            />
            <div className="rec-card-body">
              <div className="rec-card-title">{item.title}</div>
              <div className="rec-card-meta">
                {item.cityName} · {item.numberOfRooms} soba
              </div>
              <div className="rec-card-price">€ {item.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
