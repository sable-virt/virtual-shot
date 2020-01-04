import Konva from 'konva'
import { KonvaEventObject } from 'konva/types/Node'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Image, Transformer } from 'react-konva'
import ColorMatrix from '../../filters/ColorMatrixFilter'
import { createVideoElement, resizeContain } from './helpers'

const GREENBACK_MATRIX = [
  [ 1.0,  0.0, 0.0, 0.0, 0.0 ],
  [ 0.0,  1.0, 0.0, 0.0, 0.0 ],
  [ 0.0,  0.0, 1.0, 0.0, 0.0 ],
  [ 3.0, -3.0, 1.0, 1.0, 0.0 ]
]
const COLOR_MATRIX_FILTER = ColorMatrix(GREENBACK_MATRIX)
interface Props {
  stream: MediaStream | undefined
  width: number
  height: number
  selected: boolean
  onSelect: () => void
}
const KonvaVideo: React.FC<Props> = props => {
  const {
    stream,
    width,
    height,
    selected,
    onSelect,
  } = props
  const trRef = React.useRef<any>()
  const _videoRef = useRef<Konva.Image>(null)
  const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
  const [size, setSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  const _handleOnCheckSize = useCallback((e: Event) => {
    const target = e.target as HTMLVideoElement
    const size = resizeContain(target.videoWidth, target.videoHeight, width, height)
    setSize(size)
  }, [width, height])
  const _handleOnDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    setPosition({
      x: e.target.x(),
      y: e.target.y()
    })
  }, [])
  const _handleOnSelect = useCallback((e: KonvaEventObject<MouseEvent>) => {
    onSelect()
  }, [onSelect])
  const _video = useMemo(() => {
    const video: HTMLVideoElement = createVideoElement(stream)
    video.addEventListener('canplay', _handleOnCheckSize)
    return video
  }, [stream, _handleOnCheckSize])
  useEffect(() => {
    const current = trRef.current
    const videoCurrent = _videoRef.current
    if (selected && current && videoCurrent) {
      current.setNode(videoCurrent);
      current.getLayer().batchDraw();
    }
  }, [trRef, _videoRef, selected])
  useEffect(() => {
    const current = _videoRef.current
    if (current) {
      const animation = new Konva.Animation(() => {
        if (current.width() !== 0 && current.height() !== 0) {
          current.cache()
        }
      }, current)
      animation.start()
      return () => {
        animation.stop()
      }
    }
  }, [_videoRef, width, height])
  return (
    <>
      <Image
        filters={[COLOR_MATRIX_FILTER]}
        x={position.x}
        y={position.y}
        width={size.width}
        height={size.height}
        image={_video}
        ref={_videoRef}
        draggable
        onDragEnd={_handleOnDragEnd}
        onClick={_handleOnSelect}
      />
      { selected && <Transformer ref={trRef} /> }
    </>
  )
}
export default KonvaVideo
