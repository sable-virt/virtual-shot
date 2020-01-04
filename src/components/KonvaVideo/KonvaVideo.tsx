import Konva from 'konva'
import { KonvaEventObject } from 'konva/types/Node'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
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
  stream: MediaStream | null
  x: number
  y: number
  width: number
  height: number
  selected: boolean
  onSelect: () => void
}
export interface KonvaVideoHandler {
  start(): void
  stop(): void
  toggle(): boolean
}
const KonvaVideo: React.RefForwardingComponent<KonvaVideoHandler, Props> = (props, ref) => {
  const {
    stream,
    x,
    y,
    width,
    height,
    selected,
    onSelect,
  } = props
  const trRef = React.useRef<any>()
  const _videoRef = useRef<Konva.Image>(null)
  const _animationRef = useRef<Konva.Animation>()
  const _pauseRef = useRef(false)
  const [position, setPosition] = useState<{ x: number, y: number }>({ x, y })
  const [size, setSize] = useState<{ width: number, height: number }>({ width, height })
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
          const layer = current.getLayer()
          if (layer) layer.batchDraw()
          current.cache()
        }
      }, current)
      if (!_pauseRef.current) {
        animation.start()
        _pauseRef.current = false
      }
      _animationRef.current = animation
      return () => {
        animation.stop()
      }
    }
  }, [_videoRef, _animationRef, _pauseRef,  width, height])
  useImperativeHandle(ref, () => {
    return {
      start() {
        if (_animationRef.current) {
          _animationRef.current.start()
        }
      },
      stop() {
        if (_animationRef.current) {
          _animationRef.current.stop()
        }
      },
      toggle() {
        _pauseRef.current = !_pauseRef.current
        if (_animationRef.current) {
          if (_pauseRef.current) {
            _animationRef.current.stop()
          } else {
            _animationRef.current.start()
          }
        }
        return _pauseRef.current
      }
    }
  }, [_animationRef])
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
export default forwardRef(KonvaVideo)
