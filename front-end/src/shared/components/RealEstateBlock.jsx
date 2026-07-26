import { useNavigate } from 'react-router-dom';
import './RealEstateBlock.scss';
import { WishlistButton } from './WishlistButton';
import { DeleteRealEstateButton } from './DeleteRealEstateButton';

export default function RealEstateBlock({ data, onItemDeleted }) {
    const navigate = useNavigate();

    function goEdit(e) {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/apartment/edit/${data.id}`);
    }

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
            <div className="col3-price">
                <div className="price">&euro; {data.price}</div>
                <div className="price-per-m">
                    &euro; {Math.round(Number(data.price / data.area))} /m²
                </div>
            </div>
            <div className="card-actions">
                <WishlistButton realestateId={data.id} initialSaved={data.isWishlisted} />
                {data.canEdit && (
                    <button type="button" className="edit-btn" title="Izmeni" onClick={goEdit}>
                        <i className="fa-solid fa-pencil" />
                    </button>
                )}
                <DeleteRealEstateButton
                    realestateId={data.id}
                    canDelete={data.canDelete}
                    onDeleted={() => onItemDeleted?.(data.id)}
                />
            </div>
        </div>
    </div>
    )

}
