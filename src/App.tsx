import React, { useCallback, useEffect, useState } from 'react'
import { EditorContainer } from './containers/EditorContainer'
import { useApp } from './useApp'
import ImageInput from './components/ImageInput/ImageInput'
import MediaSelector from './components/MediaSelector/MediaSelector'
import './App.css'

const App: React.FC = () => {
  const {
    initialized,
    available,
    loadDevice,
  } = useApp()
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [deviceId, setDeviceId] = useState<string | undefined>()
  const [stream, setStream] = useState<MediaStream | null>(null)
  const _handleOnChangeVideo = useCallback(async (info: MediaDeviceInfo | undefined) => {
    if (info) {
      setDeviceId(info.deviceId)
    } else {
      setDeviceId(undefined)
    }
  }, [])
  const _handleOnChangeImage = useCallback((image: HTMLImageElement | null) => {
    setImage(image)
  }, [])
  const _handleOnLoadDevice = useCallback(() => {
    if (deviceId) {
      loadDevice(deviceId).then(stream => {
        setStream(stream)
      }, e => {
        alert(e)
      })
    } else {
      setStream(null)
    }
  }, [deviceId, loadDevice])
  useEffect(() => {
    const _stream = stream
    return () => {
      if (_stream) {
        _stream.getTracks().forEach(track => {
          track.stop()
        })
      }
    }
  }, [stream])
  if (!initialized) {
    return <div className="loading">Loading...</div>
  }
  if (!available) {
    return <div className="error">カメラへのアクセスができませんでした</div>
  }
  return (
    <div className="app">
      <header className="header">
        <div className="header-form">
          <ImageInput onChange={_handleOnChangeImage}/>
          <MediaSelector
            type="videoinput"
            deviceId={deviceId}
            onChange={_handleOnChangeVideo}
          />
          <button onClick={_handleOnLoadDevice}>カメラ取り込み</button>
        </div>
      </header>
      <EditorContainer
        image={image}
        stream={stream}
      />
    </div>
  )
}

export default App
