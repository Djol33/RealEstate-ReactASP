interface AmenitiesListProps {
  amenities: { id: number; name: string }[] | undefined;
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div id="amenities">
      <h2>Amenities</h2>
      <div className="amenities-list">
        {amenities.map((a) => (
          <span className="amenity-tag" key={a.id}>
            {a.name}
          </span>
        ))}
      </div>
    </div>
  );
}
