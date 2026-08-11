import { useEffect, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HeroBanner.scss';
import { formatPrice } from '../../../../shared/utils/format';
import { API_URL } from '../../../../config';

interface HeroBannerItem {
  realestateId: number;
  title: string;
  cityName: string;
  price: number;
  imageLocation: string | null;
  companyName: string | null;
}

export function HeroBanner() {
  const [items, setItems] = useState<HeroBannerItem[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/hero-banner/active`)
      .then((res) => setItems(res.data))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const item = items[index];

  function goTo(i: number) {
    setIndex((i + items.length) % items.length);
  }

  function prev(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    goTo(index - 1);
  }

  function next(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    goTo(index + 1);
  }

  return (
    <section className="hero-banner">
      {items.length > 1 && (
        <button type="button" className="hero-banner-arrow hero-banner-arrow-left" onClick={prev} aria-label="Previous featured listing">
          <i className="fa-solid fa-chevron-left" />
        </button>
      )}

      <Link
        to={`/realestate/${item.realestateId}`}
        className="hero-banner-slide"
        style={{
          backgroundImage: `url(${
            item.imageLocation ? `${API_URL}/` + item.imageLocation : 'https://placehold.co/1200x400?text=Featured+Listing'
          })`,
        }}
      >
        <div className="hero-banner-overlay">
          <h2>{item.title}</h2>
          <p>
            {item.cityName} {item.companyName ? `· ${item.companyName}` : ''}
          </p>
          <div className="hero-banner-price">€ {formatPrice(item.price)}</div>
        </div>
        <span className="hero-banner-tag" title="Featured">
          <i className="fa-solid fa-star" />
        </span>
      </Link>

      {items.length > 1 && (
        <button type="button" className="hero-banner-arrow hero-banner-arrow-right" onClick={next} aria-label="Next featured listing">
          <i className="fa-solid fa-chevron-right" />
        </button>
      )}

      {items.length > 1 && (
        <div className="hero-banner-dots">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hero-banner-dot ${i === index ? 'active' : ''}`}
              aria-label={`Show featured listing ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
