interface BasicInfoCardProps {
  area: number;
  terrace: boolean;
  registered: boolean;
  numberOfRooms: number;
  typeObjectName: string;
}

export function BasicInfoCard({ area, terrace, registered, numberOfRooms, typeObjectName }: BasicInfoCardProps) {
  return (
    <div id="basic_info">
      <span>
        <span className="header">Area</span>
        <span className="value">{area} m²</span>
      </span>
      <span>
        <span className="header">Balcony</span>
        <span className="value">{terrace ? 'Yes' : 'No'}</span>
      </span>
      <span>
        <span className="header">Rooms</span>
        <span className="value">{numberOfRooms}</span>
      </span>
      <span>
        <span className="header">Type</span>
        <span className="value">{typeObjectName}</span>
      </span>
      <span>
        <span className="header">Registered</span>
        <span className="value">{registered ? 'Yes' : 'No'}</span>
      </span>
    </div>
  );
}
