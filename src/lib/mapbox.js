// created 29-apr-2019 by rich braun <docker@instantlinux.net>

import React from 'react';
import { Error, Loading, Query } from 'react-admin';
import CardHeader from '@material-ui/core/CardHeader';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_TOKEN_MAPBOX });

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
                   layout={{ 'icon-image': data.address ? 'marker-15' : 'circle-15' }}>
                  <Feature coordinates={data.geo} />
                </Layer>
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
        <Layer type='symbol' id='marker' layout={{ 'icon-image': 'marker-15' }}>
          <Feature coordinates={data.geo} />
        </Layer>
      </Map>
  )
};
