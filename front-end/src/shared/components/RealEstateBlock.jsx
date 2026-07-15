import { Link } from 'react-router-dom';
import './RealEstateBlock.scss';

export default function RealEstateBlock({ data }) {

    return (
    <div className="result-item">
        <div className="col1">
            <img
                src={data.images[0]?.location
                    ? 'https://localhost:7154/' + data.images[0].location
                    : 'https://placehold.co/200x200?text=No+Image'}
                alt={data?.images[0]?.alt ?? data.title}
            />
        </div>
        <div className="col2">
            <div className="title">{data.title}</div>
            <div className="adress">{data.adress}, {data.cityName}</div>
            <div className="general">
                <span>{data.numberOfRooms} rooms</span> |
                <span>{data.area} m²</span>
            </div>
        </div>
        <div className="col3">
            <div className="price">&euro; {data.price}</div>
            <div className="price-per-m">
                &euro; {Math.round(Number(data.price / data.area))} /m²
            </div>
            {data.canEdit && (
                <Link to={`/apartment/edit/${data.id}`} className="edit-btn" title="Edit">
                    <i className="fa-solid fa-pencil" />
                </Link>
            )}
        </div>
    </div>
    )

}