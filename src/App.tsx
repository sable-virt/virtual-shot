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
  const [size, setSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
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
    setSize({
      width: image ? image.width : 0,
      height: image ? image.height : 0,
    })
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
    return <div>loading...</div>
  }
  if (!available) {
    return <div>カメラへのアクセスができませんでした</div>
  }
  return (
    <div className="app">
      <ImageInput onChange={_handleOnChangeImage}/>
      <MediaSelector
        type="videoinput"
        deviceId={deviceId}
        onChange={_handleOnChangeVideo}
      />
      <button onClick={_handleOnLoadDevice}>カメラ取り込み</button>
      <EditorContainer
        size={size}
        image={image}
        stream={stream}
      />
    </div>
  )
}

export default App
