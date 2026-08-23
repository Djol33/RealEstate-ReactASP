import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import   './realEstatePage.scss';
import axios from 'axios';
import { Overlay } from '../../../../shared/components/Overlay/Overlay';
import { ImageCarousel } from '../../../../shared/components/ImageCarousel/ImageCarousel';
import { PropertyMap } from '../../../../shared/components/PropertyMap/PropertyMap';
import { WishlistButton } from '../../../../shared/components/WishlistButton';
import { HeroBannerRequestModal } from '../../../../shared/components/HeroBannerRequestModal/HeroBannerRequestModal';
import { ReportListingModal } from '../../../../shared/components/ReportListingModal/ReportListingModal';
import { RealEstateAnalyticsModal } from '../../../../shared/components/RealEstateAnalyticsModal/RealEstateAnalyticsModal';
import { SEO } from '../../../../shared/components/SEO/SEO';
import { useAuth } from '../../../../AuthStore';
import { NotFound } from '../../../NotFound/NotFound';
import { formatPrice } from '../../../../shared/utils/format';
import { ImageGallery } from './parts/ImageGallery';
import { BasicInfoCard } from './parts/BasicInfoCard';
import { AmenitiesList } from './parts/AmenitiesList';
import { OwnerCard } from './parts/OwnerCard';
import { OwnerActions } from './parts/OwnerActions';
import { useViewTracking } from './useViewTracking';
import { useListingModals } from './useListingModals';
import { API_URL } from '../../../../config';

export interface realEstatePageProps {
  prop?: string;
}

export function RealEstatePage({params} ) {
  const { user } = useAuth();
  const logged = !!user;
  const [isVisible, setIsVisible] = useState(false)
  const {id} = useParams();
  const [realEstate, setRealEstate] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const modals = useListingModals();
  useViewTracking(id);

  function loadRealEstate() {
    axios.get(`${API_URL}/api/RealEstateMain/${id}` ).then((response)=>{
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

  if (notFound) return <NotFound />;
  if (!realEstate) return null;

  const isCompanyOwner = realEstate.ownerLogo != null;
  const ownerAvatarUrl = realEstate.ownerLogo?.startsWith('images/')
    ? `${API_URL}/${realEstate.ownerLogo}`
    : isCompanyOwner && realEstate.images?.[0]?.location
      ? `${API_URL}/${realEstate.images[0].location}`
      : null;

  return <div id="realestatepost">
      <SEO
        title={realEstate.title}
        description={`${realEstate.title} in ${realEstate.cityName} — ${realEstate.area} m², ${realEstate.numberOfRooms} rooms, € ${realEstate.price}.`}
        image={realEstate.images?.[0]?.location ? `${API_URL}/${realEstate.images[0].location}` : undefined}
      />

      <h1 id="title1">
        {realEstate.title}{" "}
        <WishlistButton realestateId={realEstate.id} initialSaved={realEstate.isWishlisted} />
      </h1>

      <h2 id="adress">Adress: {realEstate.adress}</h2>

      <ImageGallery
        images={realEstate.images}
        onImageClick={() => setIsVisible(true)}
        statusLabel={realEstate.statusLabel || 'Available'}
      />

      <h2 id="price">
        <div id="textprice">{formatPrice(realEstate.price)} &euro;</div>
      </h2>

      <BasicInfoCard
        area={realEstate.area}
        terrace={realEstate.terrace}
        registered={realEstate.registered}
        numberOfRooms={realEstate.numberOfRooms}
        typeObjectName={realEstate.typeObjectName}
      />

      <AmenitiesList amenities={realEstate.amenities} />

      <div id="aditionalDescription">
        <h2>Additional Informations</h2>
        <p>{realEstate.description}</p>
      </div>

      {realEstate.showMap && realEstate.lat && realEstate.lng && (
        <PropertyMap lat={realEstate.lat} lng={realEstate.lng} title={realEstate.title} />
      )}

      <OwnerCard
        ownerId={realEstate.owner}
        fName={realEstate.f_name}
        lName={realEstate.l_name}
        email={realEstate.email}
        avatarUrl={ownerAvatarUrl}
        logged={logged}
        isOwnListing={user?.id === realEstate.owner}
        canReport={realEstate.isActive !== false}
        reportSent={modals.reportSent}
        onReportClick={modals.openReportModal}
      />

      <OwnerActions
        realestateId={realEstate.id}
        canEdit={realEstate.canEdit}
        canDelete={realEstate.canDelete}
        canViewAnalytics={realEstate.canViewAnalytics}
        canRequestHeroBanner={realEstate.canRequestHeroBanner}
        heroBannerStatus={realEstate.heroBannerStatus}
        onAnalyticsClick={modals.openAnalyticsModal}
        onHeroBannerClick={modals.openHeroModal}
      />

      {modals.showHeroModal && (
        <HeroBannerRequestModal
          realestateId={realEstate.id}
          onClose={modals.closeHeroModal}
          onSuccess={() => {
            modals.closeHeroModal();
            loadRealEstate();
          }}
        />
      )}

      {modals.showReportModal && (
        <ReportListingModal
          realestateId={realEstate.id}
          onClose={modals.closeReportModal}
          onSuccess={() => {
            modals.closeReportModal();
            modals.markReportSent();
          }}
        />
      )}

      {modals.showAnalyticsModal && (
        <RealEstateAnalyticsModal
          realestateId={realEstate.id}
          heroBannerStatus={realEstate.heroBannerStatus}
          onClose={modals.closeAnalyticsModal}
        />
      )}

      <Overlay isVisible={isVisible} changeVisibility={setIsVisible}>
        <ImageCarousel imageArray={realEstate?.images}/>
      </Overlay>
    </div>

}
