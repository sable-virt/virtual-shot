import React, { useEffect, useRef } from 'react'

interface Props {
  stream: MediaStream | undefined
  width?: number
  height?: number
  onInit?: (video: HTMLVideoElement) => void
}
const VideoPlayer: React.FC<Props> = props => {
  const {
    width = 960,
    height = 640,
    stream,
    onInit
  } = props
  const _videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (_videoRef.current) {
      _videoRef.current.srcObject = stream || null
    }
  }, [_videoRef, stream])
  useEffect(() => {
    if (onInit && _videoRef.current) {
      onInit(_videoRef.current)
    }
  }, [_videoRef, onInit])
  return (
    <video
      ref={_videoRef}
      width={width}
      height={height}
      playsInline={true}
      autoPlay={true}
      muted={true}
    />
  )
}
export default VideoPlayer
