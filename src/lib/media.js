// created 2-feb-2020 by docker@instantlinux.net

import React from 'react';
import * as Dropzone from 'react-dropzone-uploader';
import ImageGallery from 'react-image-gallery';
import 'react-dropzone-uploader/dist/styles.css';
import 'react-image-gallery/styles/css/image-gallery.css';

function Headers() {
    return {
	Accept: 'application/json',
	'Content-Type': 'application/json',
	Authorization: 'Basic ' + btoa(
	    sessionStorage.getItem('uid') + ':' +
		sessionStorage.getItem('token')),
	mode: 'no-cors'
    }
}

export const MediaInput = props => {
  const storage_id = sessionStorage.getItem('storage_id')
  var mediaUrl = JSON.parse(sessionStorage.getItem('resource_endpoints'))['file']
  const getUploadParams = async ({ meta: {
          duration, height, lastModifiedDate, name, size, type, videoHeight,
          videoWidth, width} }) => {
      let params;
      if (['video/mp4', 'video/mpeg'].includes(type)) {
          params = {
            storage_id, content_type: type, duration, height: videoHeight,
            modified: lastModifiedDate, name, parent_id: props.parent_id,
            size, width: videoWidth}
      }
      else {
          params = {
            storage_id, content_type: type, height, modified: lastModifiedDate,
            name, parent_id: props.parent_id, size, width}
      }
      const api = await fetch(
          mediaUrl + '/file_upload_url', {
              body: JSON.stringify(params),
              headers: Headers(),
              method: 'POST',
          })
      const get_presigned = await api.json()
      return {
        fields: get_presigned.params,
        meta: { fileId: get_presigned.file_id },
        url: get_presigned.upload_url
      }
  }

  const handleChangeStatus = ({ meta }, status) => {
    // console.log(status, meta)
    if (['aborted', 'done', 'error_upload'].includes(status)) {
      fetch(mediaUrl + '/upload_complete/' + meta.fileId + '?status=' + status,
            { headers: Headers(), method: 'POST' })
    }
  }

  const handleSubmit = (files, allFiles) => {
    // console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone.default
      getUploadParams={getUploadParams}
      inputContent='Drop photos or click here'
      inputWithFilesContent='Add another  '
      maxFiles={10}
      maxSizeBytes={31457280}
      minSizeBytes={1024}
      multiple={true}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      styles={{ dropzone: { minHeight: 200, maxHeight: 250 },
	     }}
      accept="image/*,video/*"
    />
  )
}

class GalleryView extends React.Component {
    // This class exists solely to fetch media before displaying
    // ImageGallery; dataProvider only has the album record, not
    // the media details
    constructor(props){
	super(props);
	this.state = {
	    album_id: props.id,
	    isLoading: true,
	    media: [],
            mediaUrl: JSON.parse(sessionStorage.getItem('resource_endpoints'))['file'],
	    error: null
	}
    }

    componentDidMount(){
	fetch(this.state.mediaUrl + '/album/' + this.state.album_id + '?details=true',
	        { headers: Headers()})
	    .then (response => {
		if (response.ok) {
		    return response.json()
		}
		else {
		    throw new Error(`error=${response.json().message} status=${response.status}` )
		}
	    })
	    .then(data => this.setState({
		isLoading: false,
		media: data.media,
	    }))
	    .catch(error => this.setState({ error, isLoading: false }))
    }

    render() {
        const { isLoading, media, error } = this.state;
	if (error) {
	    return <span>{error.message}</span>
	}
	if (isLoading) {
	    return <span>Loading</span>
	}
	else {
	    return <ImageGallery
	    items={media} thumbnailPosition='right' showIndex={true} />
	}
    }
}

export const MediaGallery = ({ record }) => {
    return <GalleryView id={record.id} />
}
