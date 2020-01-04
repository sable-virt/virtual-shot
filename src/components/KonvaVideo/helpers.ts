export function resizeContain(width: number, height: number, maxWidth: number, maxHeight: number) {
  const size = {
    width,
    height
  }
  if(size.width > maxWidth){
    const ratio = maxWidth / size.width
    size.height = size.height * ratio
    size.width = size.width * ratio
  }
  if(size.height > maxHeight){
    const ratio = maxHeight / size.height
    size.width = size.width * ratio
    size.height = size.height * ratio
  }
  return size
}
export function createVideoElement(stream: MediaStream | undefined) {
  const video: HTMLVideoElement = document.createElement('video')
  video.muted = true
  video.autoplay = true
  video.setAttribute('playsinline', 'true')
  video.srcObject = stream || null
  video.play()
  return video
}
