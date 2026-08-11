interface Amenity {
  id: number;
  name: string;
  isFilterable: boolean;
  isActive: boolean;
}

interface AmenitiesTableProps {
  amenities: Amenity[];
  onEdit: (a: Amenity) => void;
  onDelete: (a: Amenity) => void;
  onRestore: (a: Amenity) => void;
}

export function AmenitiesTable({ amenities, onEdit, onDelete, onRestore }: AmenitiesTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Filterable</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {amenities.length === 0 && (
            <tr><td colSpan={4} className="empty">No amenities yet.</td></tr>
          )}
          {amenities.map((a) => (
            <tr key={a.id} className={!a.isActive ? 'is-inactive' : ''}>
              <td>{a.name}</td>
              <td>
                <span className={`filter-badge ${a.isFilterable ? 'yes' : 'no'}`}>
                  {a.isFilterable ? 'Yes' : 'No'}
                </span>
              </td>
              <td>
                <span className={`status-badge ${a.isActive ? 'active' : 'inactive'}`}>
                  {a.isActive ? 'Active' : 'Deleted'}
                </span>
              </td>
              <td className="actions">
                {a.isActive ? (
                  <>
                    <button className="btn-edit" onClick={() => onEdit(a)}>Edit</button>
                    <button className="btn-del" onClick={() => onDelete(a)}>Delete</button>
                  </>
                ) : (
                  <button className="btn-restore" onClick={() => onRestore(a)}>Restore</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
