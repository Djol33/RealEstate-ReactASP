import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet'
import { useState } from 'react';
import 'leaflet/dist/leaflet.css'
 
function KlikHandler({ onKlik }) {
  useMapEvents({
    click(e) {
      onKlik({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
  })
  return null
}
function PomeriMapu({ pozicija }) {
  const map = useMap()
  useEffect(() => {
    if (pozicija) map.flyTo([pozicija.lat, pozicija.lng], 14)
  }, [pozicija])
  return null
}
export function Map( ) {
    const [centar, setCentar] = useState({ lat: 45.2671, lng: 19.8335 })
  const [radius, setRadius] = useState(2000)  
  const [pozicija, setPozicija] = useState(null)
  useEffect(()=>{
    console.log(pozicija)

  }, [pozicija])
  function traziLokaciju() {
    if (!navigator.geolocation) {
     
      return
    }

     

    navigator.geolocation.getCurrentPosition(
      // Uspeh — korisnik dao dozvolu
      (position) => {
        setPozicija({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
         
      },
      // Greška — odbio dozvolu ili timeout
      (err) => {
        console.error(err)
        
      },
      // Opcije
      {
        enableHighAccuracy: true, // GPS preciznost
        timeout: 10000,           // čekaj max 10s
        maximumAge: 0             // ne koristi keširanu lokaciju
      }
    )
  }
  return <>         <button onClick={ (e) =>{traziLokaciju(); e.preventDefault();}}  >
       Koristi moju lokaciju
        </button>
 <MapContainer   center={[centar.lat, centar.lng]} zoom={13} style={{ width:"100%" ,height: 300 }}>



        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


      
    <KlikHandler onKlik={setPozicija} />
        {pozicija && (
          <>
            <Marker position={[pozicija.lat, pozicija.lng]} />

            <Circle
              center={[pozicija.lat, pozicija.lng]}
              radius={radius}
              pathOptions={{
                color: '#185FA5',
                fillColor: '#185FA5',
                fillOpacity: 0.1
              }}
            />
          </>
        )}
         <PomeriMapu pozicija={pozicija} />
      </MapContainer>
      </>
}
