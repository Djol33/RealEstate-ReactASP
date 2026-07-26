import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import   './realEstatePage.scss';
import axios from 'axios';
import { Overlay } from '../../../../shared/components/Overlay/Overlay';
import { ImageCarousel } from '../../../../shared/components/ImageCarousel/ImageCarousel';
import { PropertyMap } from '../../../../shared/components/PropertyMap/PropertyMap';
import { WishlistButton } from '../../../../shared/components/WishlistButton';
import { DeleteRealEstateButton } from '../../../../shared/components/DeleteRealEstateButton';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../AuthStore';
export interface realEstatePageProps {
  prop?: string;
}

export function RealEstatePage({params} ) {
  const { user } = useAuth();
  const logged = !!user;
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false)
  const {id} = useParams();
  const [realEstate, setRealEstate] = useState<any>(null);
  useEffect(()=>{
    axios.get(`https://localhost:7154/api/RealEstateMain/${id}` ).then((response)=>{
 
 console.log(response.data)
      setRealEstate(response.data);


   


    })

  },[])

  useEffect(() => {
    if (!id) return;
    const timer = setTimeout(() => {
      axios.post(`https://localhost:7154/api/RealEstateMain/${id}/view`).catch(() => {});
    }, 3000);
    return () => clearTimeout(timer);
  }, [id]);

  function showImage(){
    setIsVisible(true);
  }

  if (!realEstate) return null;

  return <div id="realestatepost">
      {/* Title with wishlist */}
      <h1 id="title1">
        {realEstate.title}{" "}
        <WishlistButton realestateId={realEstate.id} initialSaved={realEstate.isWishlisted} />
      </h1>

      {/* Address */}
      <h2 id="adress">Adress: {realEstate.adress}</h2>

      {/* Image block */}
      <div id="images">
        {realEstate.images && realEstate.images.length > 0 ? (
          realEstate.images.map((img, i) => (
            <div onClick={showImage}
              key={img.id}
              style={{ backgroundImage: `url(https://localhost:7154/${img.location})` }}
              className={`${i > 3 ? "d-none" : ""} ${i === 0 ? "main" : "sidebar" + i}`}
              image-id={i}
            ></div>
          ))
        ) : (
          <div
            style={{ backgroundImage: "url('https://placehold.co/800x600?text=No+Image')" }}
            className="main"
            image-id="0"
          ></div>
        )}
      </div>

      {/* Price */}
      <h2 id="price">
        <div id="textprice">{realEstate.price} &euro;</div>
      </h2>

      {/* Basic info */}
      <div id="basic_info">
        <span>
          <span className="header">Area</span>
          <span className="value">{realEstate.area} m²</span>
        </span>
        <span>
          <span className="header">Balcony</span>
          <span className="value">{realEstate.terrace ? "Yes" : "No"}</span>
        </span>
        <span>
          <span className="header">Rooms</span>
          <span className="value">{realEstate.numberOfRooms}</span>
        </span>
        <span>
          <span className="header">Type</span>
          <span className="value">{realEstate.typeObjectName}</span>
        </span>
      </div>

      {/* Description */}
      <div id="aditionalDescription">
        <h2>Additional Informations</h2>
        <p>{realEstate.description}</p>
      </div>

      {/* Map */}
      {realEstate.lat && realEstate.lng && (
        <PropertyMap lat={realEstate.lat} lng={realEstate.lng} title={realEstate.title} />
      )}

      {/* Owner info */}
      <div id="owner">
        <h1>
          {logged ? (
            <Link to={`/user/${realEstate.owner}`}>
              {realEstate.f_name} {realEstate.l_name}
            </Link>
          ) : (
            <span>{realEstate.f_name} {realEstate.l_name}</span>
          )}
        </h1>
        {logged ? (
          <p>Email: <a href={`mailto:${realEstate.email}`}>{realEstate.email}</a></p>
        ) : (
          <p>
            Email: {realEstate.email}
            <br />
            <a style={{ color: "blue" }} href="login">
              Login
            </a>{" "}
            to see full email
          </p>
        )}
        {logged && user?.id !== realEstate.owner && (
          <button
            type="button"
            className="message-owner-btn"
            onClick={() => navigate(`/messages/${realEstate.owner}`)}
          >
            <i className="fa-solid fa-envelope" /> Send message
          </button>
        )}
      </div>

      {/* Edit/Delete for owner or admin */}
      {(realEstate.canEdit || realEstate.canDelete) && (
        <div id="holder_edit">
          {realEstate.canEdit && (
            <button
              type="button"
              className="edit-btn"
              title="Edit"
              onClick={() => navigate(`/apartment/edit/${realEstate.id}`)}
            >
              <i className="fa-solid fa-pencil" />
            </button>
          )}
          <DeleteRealEstateButton
            realestateId={realEstate.id}
            canDelete={realEstate.canDelete}
            onDeleted={() => navigate('/')}
          />
        </div>
      )}

      <Overlay isVisible={isVisible} changeVisibility={setIsVisible}>
        <ImageCarousel imageArray={realEstate?.images}/>

      </Overlay>
    </div>
  
}
