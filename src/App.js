import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, Popup } from 'react-map-gl';
import axios from 'axios';
import ship from './assets/ship.PNG';
import { useEffect, useState } from 'react';
import opencage from 'opencage-api-client';
import { data } from './data/data';

function App() {
  const [viewState, setViewState] = useState({
    longitude: '',
    latitude: '',
    zoom: 2,
  });
  const [markerPosition, setMarkerPosition] = useState({
    longitude: '',
    latitude: '',
  });

  // REPLACE THIS STATE WITH {} WHEN DONE WITH DUMMY DATA
  const [currentLocationData, setCurrentLocationData] = useState(data);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    axios
      .get('http://api.open-notify.org/iss-now.json')
      .then((res) => {
        setViewState({
          ...viewState,
          longitude: res.data.iss_position.longitude,
          latitude: res.data.iss_position.latitude,
        });

        setMarkerPosition({
          longitude: res.data.iss_position.longitude,
          latitude: res.data.iss_position.latitude,
        });

        // <<<<< UNCOMMENT TO CALL OPENCAGE TO GET LOCATION DATA >>>>>

        // callOpenCage(
        //   res.data.iss_position.latitude,
        //   res.data.iss_position.longitude
        // );
      })
      .catch();
  }, []);

  const callOpenCage = (lat, lon) => {
    opencage
      .geocode({
        q: `${lat}, ${lon}`,
        key: '4cf0f5f55bd7487e935f15ca4c209938',
      })
      .then((data) => {
        console.log('result for testing no component error', data);
        setCurrentLocationData(data.results[0].components);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  // useEffect(() => {
  //   console.log('----->', showPopup);
  // }, [showPopup]);

  if (!viewState.latitude || !viewState.longitude) return;

  return (
    <Map
      {...viewState}
      onMove={(e) => {
        setViewState(e.viewState);
      }}
      style={{ width: '80vw', height: '80vh' }}
      mapStyle='mapbox://styles/zaar/cl4q1117q000w15qyg4pyef6s'
      mapboxAccessToken='pk.eyJ1IjoiemFhciIsImEiOiJjbDRwd2s4NDEwYmZhM2pscHFoNmd2cXgyIn0.rBjxlh-4PyvOnILgV2gJXg'
    >
      <Marker
        latitude={markerPosition.latitude}
        longitude={markerPosition.longitude}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setShowPopup(!showPopup);
        }}
      >
        <img
          style={{ width: '40px', height: '40px' }}
          alt='ship map marker'
          src={ship}
        />
      </Marker>

      {showPopup && (
        <Popup
          longitude={markerPosition.longitude}
          latitude={markerPosition.latitude}
          anchor='top'
          offset={17}
          onClose={() => setShowPopup(false)}
          closeOnClick
        >
          {currentLocationData.country
            ? currentLocationData.country
            : currentLocationData.body_of_water}
        </Popup>
      )}
    </Map>
  );
}

export default App;

// function App() {
//   const [viewport, setViewport] = useState({
//     longitude: '',
//     latitude: '',
//     zoom: 2,
//   });

//   useEffect(() => {
//     axios
//       .get('http://api.open-notify.org/iss-now.json')
//       .then((res) =>
//         setViewport({
//           ...viewport,
//           longitude: res.data.iss_position.longitude,
//           latitude: res.data.iss_position.latitude,
//         })
//       )
//       .catch();
//   }, []);

//   useEffect(() => {
//     console.log(viewport);
//   }, [viewport]);

//   if (!viewport.latitude || !viewport.longitude) return;

//   return (
//     <div>
//       <Map
//         initialViewState={{ ...viewport }}
//         style={{ width: '75vw', height: '75vh' }}
//         mapStyle='mapbox://styles/zaar/cl4q1117q000w15qyg4pyef6s'
//         mapboxAccessToken='pk.eyJ1IjoiemFhciIsImEiOiJjbDRwd2s4NDEwYmZhM2pscHFoNmd2cXgyIn0.rBjxlh-4PyvOnILgV2gJXg'
//       />
//     </div>
//   );
// }

// export default App;
