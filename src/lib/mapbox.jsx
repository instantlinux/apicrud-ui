// created 29-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { Error, Loading, Query } from 'react-admin';
import CardHeader from '@material-ui/core/CardHeader';
import mapboxgl from 'mapbox-gl';
import ReactMapboxGl, { Feature, Layer, Marker } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// TODO this is not working with ci-test
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require(
    'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

export const Map = ReactMapboxGl({
    accessToken: import.meta.env.REACT_APP_TOKEN_MAPBOX });
// See https://labs.mapbox.com/maki-icons/  (but not all are available)
const markerIcon = 'marker-11'

export const EventLocationMap = ({ id }) => {
  return (
    <Query type='getOne' resource='event' payload={{ id: id }}>
        {({ data, loading, error }) => 
            loading ? <Loading />
            : error ? <Error /> :
            <Query type='getOne' resource='location' payload={{ id: data.location_id }}>
                {({ data, loading, error }) => 
                    loading ? <Loading />
                    : error ? <Error /> :
              <div style={{ backgroundColor: '#E0E0E0' }} >
              <CardHeader title={data.address ? data.address : data.neighborhood}
                 titleTypographyProps={{align: 'center', variant: 'subtitle1' }} />
              <Map
                // See https://github.com/alex3165/react-mapbox-gl/issues/498
                // eslint-disable-next-line
                style='mapbox://styles/mapbox/streets-v8'
                center={data.geo} zoom={[data.address ? 15 : 11]}
                containerStyle={{ height: "30vh", width: "50vw" }}>
                <Layer type='symbol' id='marker'
                     layout={{ 'icon-image': data.address ? markerIcon : 'circle-15' }}>
                  <Feature coordinates={data.geo} />
                </Layer>
               {data.name && <Marker coordinates={data.geo} anchor="top">
                  {data.name}
                </Marker>}
              </Map>
              </div>
            }
          </Query>
        }
      </Query>
  )
};

export const LocationMap = data => {
  return (
      <Map
        // eslint-disable-next-line
        style='mapbox://styles/mapbox/streets-v8'
        center={data.geo} zoom={[data.address ? 15 : 11]}
        containerStyle={{ height: "30vh", width: "50vw" }}>
        <Layer type='symbol' id='marker' layout={{ 'icon-image': markerIcon }}>
          <Feature coordinates={data.geo} />
        </Layer>
       {data.name && <Marker coordinates={data.geo} anchor="top">
          {data.name}
        </Marker>}
      </Map>
  )
};
