class MediaStreamService {
  async checkVideoStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
    stream.getTracks().forEach(track => {
      track.stop()
    })
    return true
  }
  getVideoStream(videoStreamId: string) {
    const constraints = {
      video: {
        deviceId: videoStreamId,
        width: {
          ideal: 1024
        },
        height: {
          ideal: 768
        },
        frameRate: {
          ideal: 60,
          min: 20
        },
        facingMode: 'user',
      },
      audio: false
    }
    return navigator.mediaDevices.getUserMedia(constraints)
  }
}
export default new MediaStreamService()
