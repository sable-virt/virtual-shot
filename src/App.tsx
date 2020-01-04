import { KonvaEventObject } from 'konva/types/Node'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Stage, Image } from 'react-konva'
import ImageInput from './components/ImageInput/ImageInput'
import KonvaVideo from './components/KonvaVideo/KonvaVideo'
import MediaSelector from './components/MediaSelector/MediaSelector'
import DownloadService from './services/DownloadService'
import MediaStreamService from './services/MediaStreamService'
import './App.css'

const App: React.FC = () => {
  const _stageRef = useRef<any>()
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [size, setSize] = useState<{ width: number, height: number}>({ width: 0, height: 0 })
  const [deviceId, setDeviceId] = useState<string | undefined>()
  const [stream, setStream] = useState<MediaStream>()
  const [selectedId, setSelectedId] = useState<string>()
  const _handleOnChangeVideo = useCallback((info: MediaDeviceInfo | undefined) => {
    if (info) {
      setDeviceId(info.deviceId)
    } else {
      setDeviceId(undefined)
    }
  }, [])
  const _handleOnLoadDevice = useCallback(async(deviceId: string) => {
    const stream = await MediaStreamService.getVideoStream(deviceId)
    setStream(stream)
  }, [])
  const _handleOnChangeImage = useCallback((image: HTMLImageElement | null) => {
    setImage(image)
    setSize({
      width: image ? image.width : 0,
      height: image ? image.height : 0
    })
  }, [])
  const _handleOnSelect = useCallback((id: string) => () => {
    setSelectedId(id)
  }, [])
  const _handleOnMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.unselectable
    if (clickedOnEmpty) {
      setSelectedId(undefined)
    }
  }, [])
  const _handleOnMouseLeave = useCallback(() => {
    setSelectedId(undefined)
  }, [])
  const _handleOnExport = useCallback(() => {
    const stage = _stageRef.current
    if (stage) {
      const data = stage.toDataURL()
      DownloadService.download(data)
    }
  }, [_stageRef])

  const _video = useMemo(() => {
    if (!image || size.width === 0 || size.height === 0) return
    return (
      <KonvaVideo
        selected={selectedId === 'camera'}
        width={size.width}
        height={size.height}
        stream={stream}
        onSelect={_handleOnSelect('camera')}
      />
    )
  }, [image, size, stream, selectedId, _handleOnSelect])

  useEffect(() => {
    if (deviceId) {
      _handleOnLoadDevice(deviceId)
    }
  }, [deviceId, _handleOnLoadDevice])
  return (
    <div className="app">
      <ImageInput onChange={_handleOnChangeImage}/>
      <MediaSelector
        type="videoinput"
        deviceId={deviceId}
        onInit={_handleOnChangeVideo}
        onChange={_handleOnChangeVideo}
      />
      <div className="editor" onMouseLeave={_handleOnMouseLeave}>
        <Stage width={size.width} height={size.height} onMouseDown={_handleOnMouseDown} ref={_stageRef}>
          <Layer>
            <Image
              unselectable
              x={0}
              y={0}
              width={size.width}
              height={size.height}
              image={image || undefined}
            />
            {_video}
          </Layer>
        </Stage>
      </div>
      <div hidden={!_video}>
        <button type="button" onClick={_handleOnExport}>export</button>
      </div>
    </div>
  )
}

export default App
