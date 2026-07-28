import './Placeholder.css';

export interface PlaceholderProps {
  count?: number;
}

export function Placeholder({ count = 5 }: PlaceholderProps) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="sk-col1">
            <div className="skeleton sk-image" />
          </div>
          <div className="sk-col2">
            <div className="skeleton sk-line sk-title" />
            <div className="skeleton sk-line sk-sub" />
            <div className="skeleton sk-line sk-meta" />
          </div>
          <div className="sk-col3">
            <div className="skeleton sk-line sk-price" />
            <div className="skeleton sk-line sk-pricesub" />
            <div className="sk-actions">
              <div className="skeleton sk-dot" />
              <div className="skeleton sk-dot" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export interface ShelfPlaceholderProps {
  count?: number;
}

export function ShelfPlaceholder({ count = 6 }: ShelfPlaceholderProps) {
  return (
    <div className="skeleton-rec-row">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-rec-card" key={i}>
          <div className="skeleton sk-rec-img" />
          <div className="sk-rec-body">
            <div className="skeleton sk-line sk-title" />
            <div className="skeleton sk-line sk-meta" />
            <div className="skeleton sk-line sk-price" />
          </div>
        </div>
      ))}
    </div>
  );
}
