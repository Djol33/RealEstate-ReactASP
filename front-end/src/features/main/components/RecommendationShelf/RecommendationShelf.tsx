import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RecommendationShelf.scss';
import { ShelfPlaceholder } from '../../../../shared/components/Placeholder/Placeholder';
import { formatPrice } from '../../../../shared/utils/format';
import { API_URL } from '../../../../config';

interface RecommendationShelfProps {
  title: string;
  endpoint: string;
  count?: number;
}

export function RecommendationShelf({ title, endpoint, count = 8 }: RecommendationShelfProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}${endpoint}?count=${count}`)
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoaded(true));
  }, [endpoint, count]);

  function updateArrows() {
    const el = rowRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateArrows();
    const el = rowRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [items]);

  function scrollByCards(direction: number) {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  if (loaded && items.length === 0) return null;

  if (!loaded) {
    return (
      <section className="rec-shelf">
        <h2 className="rec-shelf-title">{title}</h2>
        <ShelfPlaceholder count={count} />
      </section>
    );
  }

  return (
    <section className="rec-shelf">
      <h2 className="rec-shelf-title">{title}</h2>
      <div className="rec-shelf-viewport">
        <button
          type="button"
          className={`rec-arrow rec-arrow-left ${canLeft ? '' : 'is-hidden'}`}
          onClick={() => scrollByCards(-1)}
          aria-label="Scroll left"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>

        <div className="rec-shelf-row" ref={rowRef}>
          {items.map((item) => (
            <Link key={item.id} to={`/realestate/${item.id}`} className="rec-card">
              <div
                className="rec-card-img"
                style={{
                  backgroundImage: `url(${
                    item.images?.[0]?.location
                      ? `${API_URL}/` + item.images[0].location
                      : 'https://placehold.co/300x200?text=No+Image'
                  })`,
                }}
              />
              <div className="rec-card-body">
                <div className="rec-card-title">{item.title}</div>
                <div className="rec-card-meta">
                  {item.cityName} · {item.numberOfRooms} rooms
                </div>
                <div className="rec-card-price">€ {formatPrice(item.price)}</div>
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          className={`rec-arrow rec-arrow-right ${canRight ? '' : 'is-hidden'}`}
          onClick={() => scrollByCards(1)}
          aria-label="Scroll right"
        >
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </section>
  );
}
