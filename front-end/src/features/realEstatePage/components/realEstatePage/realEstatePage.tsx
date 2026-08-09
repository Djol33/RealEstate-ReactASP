import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import   './realEstatePage.scss';
import axios from 'axios';
import { Overlay } from '../../../../shared/components/Overlay/Overlay';
import { ImageCarousel } from '../../../../shared/components/ImageCarousel/ImageCarousel';
import { PropertyMap } from '../../../../shared/components/PropertyMap/PropertyMap';
import { WishlistButton } from '../../../../shared/components/WishlistButton';
import { DeleteRealEstateButton } from '../../../../shared/components/DeleteRealEstateButton';
import { HeroBannerRequestModal } from '../../../../shared/components/HeroBannerRequestModal/HeroBannerRequestModal';
import { ReportListingModal } from '../../../../shared/components/ReportListingModal/ReportListingModal';
import { RealEstateAnalyticsModal } from '../../../../shared/components/RealEstateAnalyticsModal/RealEstateAnalyticsModal';
import { SEO } from '../../../../shared/components/SEO/SEO';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../AuthStore';
import { NotFound } from '../../../NotFound/components/NotFound/NotFound';
import { formatPrice } from '../../../../shared/utils/format';
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
  const [notFound, setNotFound] = useState(false);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  function loadRealEstate() {
    axios.get(`https://localhost:7154/api/RealEstateMain/${id}` ).then((response)=>{
      setRealEstate(response.data);
    }).catch(() => {
      setNotFound(true);
    })
  }

  useEffect(()=>{
    setRealEstate(null);
    setNotFound(false);
    loadRealEstate();
  },[id])

  useEffect(() => {
    if (!id) return;
    const timer = setTimeout(() => {
      axios.post(`https://localhost:7154/api/RealEstateMain/${id}/view`).catch(() => {});
    }, 3000);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const startedAt = Date.now();

    function sendDuration() {
      const seconds = Math.round((Date.now() - startedAt) / 1000);
      if (seconds < 3) return;
      axios.post(
        `https://localhost:7154/api/RealEstateMain/${id}/view-duration`,
        { durationSeconds: seconds },
        { timeout: 2000 }
      ).catch(() => {});
    }

    window.addEventListener('beforeunload', sendDuration);
    return () => {
      window.removeEventListener('beforeunload', sendDuration);
      sendDuration();
    };
  }, [id]);

  function showImage(){
    setIsVisible(true);
  }

  if (notFound) return <NotFound />;
  if (!realEstate) return null;

  return <div id="realestatepost">
      <SEO
        title={realEstate.title}
        description={`${realEstate.title} in ${realEstate.cityName} — ${realEstate.area} m², ${realEstate.numberOfRooms} rooms, € ${realEstate.price}.`}
        image={realEstate.images?.[0]?.location ? `https://localhost:7154/${realEstate.images[0].location}` : undefined}
      />
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
        <div id="textprice">{formatPrice(realEstate.price)} &euro;</div>
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

      {/* Amenities */}
      {realEstate.amenities && realEstate.amenities.length > 0 && (
        <div id="amenities">
          <h2>Amenities</h2>
          <div className="amenities-list">
            {realEstate.amenities.map((a) => (
              <span className="amenity-tag" key={a.id}>
                {a.name}
              </span>
            ))}
          </div>
        </div>
      )}

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
        {logged && user?.id !== realEstate.owner && !reportSent && (
          <button
            type="button"
            className="report-listing-btn"
            onClick={() => setShowReportModal(true)}
          >
            <i className="fa-solid fa-flag" /> Report listing
          </button>
        )}
        {reportSent && (
          <span className="report-sent-note">
            <i className="fa-solid fa-check" /> Report sent, thank you
          </span>
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
          {realEstate.canViewAnalytics && (
            <button
              type="button"
              className="analytics-btn"
              title="View analytics"
              onClick={() => setShowAnalyticsModal(true)}
            >
              <i className="fa-solid fa-chart-line" />
            </button>
          )}
        </div>
      )}

      {/* Hero banner request (company owners only) */}
      {realEstate.canRequestHeroBanner && (
        <button type="button" className="hero-banner-request-btn" onClick={() => setShowHeroModal(true)}>
          <i className="fa-solid fa-star" /> Request hero banner placement
        </button>
      )}
      {realEstate.heroBannerStatus === 'Pending' && (
        <div className="hero-banner-status pending">
          <i className="fa-solid fa-clock" /> Hero banner request pending admin approval
        </div>
      )}
      {realEstate.heroBannerStatus === 'Approved' && (
        <div className="hero-banner-status approved">
          <i className="fa-solid fa-star" /> This listing is currently featured on the homepage
        </div>
      )}

      {showHeroModal && (
        <HeroBannerRequestModal
          realestateId={realEstate.id}
          onClose={() => setShowHeroModal(false)}
          onSuccess={() => {
            setShowHeroModal(false);
            loadRealEstate();
          }}
        />
      )}

      {showReportModal && (
        <ReportListingModal
          realestateId={realEstate.id}
          onClose={() => setShowReportModal(false)}
          onSuccess={() => {
            setShowReportModal(false);
            setReportSent(true);
          }}
        />
      )}

      {showAnalyticsModal && (
        <RealEstateAnalyticsModal
          realestateId={realEstate.id}
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}

      <Overlay isVisible={isVisible} changeVisibility={setIsVisible}>
        <ImageCarousel imageArray={realEstate?.images}/>

      </Overlay>
    </div>

}
