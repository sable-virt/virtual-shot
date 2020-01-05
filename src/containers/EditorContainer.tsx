import { KonvaEventObject } from 'konva/types/Node'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Image, Layer, Stage, StageProps } from 'react-konva'
import DownloadService from '../services/DownloadService'
import KonvaVideo, { KonvaVideoHandler } from '../components/KonvaVideo/KonvaVideo'

const DEFAULT_VIDEO_SIZE = {
  width: 320,
  height: 240
}

interface Props {
  image: HTMLImageElement | null
  stream: MediaStream | null
}
export const EditorContainer: React.FC<Props> = props => {
  const {
    image,
    stream,
  } = props
  const _stageRef = useRef<Stage & StageProps>(null)
  const _videoRef = useRef<KonvaVideoHandler>(null)
  const [selectedId, setSelectedId] = useState<string>()
  const size = useMemo(() => {
    return {
      width: image ? image.width : 0,
      height: image ? image.height : 0
    }
  }, [image])
  const _handleOnMouseLeave = useCallback(() => {
    setSelectedId(undefined)
  }, [])
  const _handleOnMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.unselectable
    if (clickedOnEmpty) {
      setSelectedId(undefined)
    }
  }, [])
  const _handleOnSelect = useCallback((id: string) => () => {
    setSelectedId(id)
  }, [])
  const _handleOnPause = useCallback(() => {
    if (_videoRef.current) {
      _videoRef.current.toggle()
    }
  }, [_videoRef])
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
        ref={_videoRef}
        selected={selectedId === 'camera'}
        x={0}
        y={0}
        width={DEFAULT_VIDEO_SIZE.width}
        height={DEFAULT_VIDEO_SIZE.height}
        stream={stream}
        onSelect={_handleOnSelect('camera')}
      />
    )
  }, [image, size, stream, selectedId, _handleOnSelect])
  return (
    <div className="editor-container">
      <div className="editor" onMouseLeave={_handleOnMouseLeave}>
        <Stage className="editor-layer" width={size.width} height={size.height} onMouseDown={_handleOnMouseDown} ref={_stageRef}>
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
      <footer className="editor-footer">
        <button type="button" onClick={_handleOnPause} disabled={!(!!_video)}>一時停止</button>
        <button type="button" onClick={_handleOnExport} disabled={!(!!_video)}>保存</button>
      </footer>
    </div>
  )
}
