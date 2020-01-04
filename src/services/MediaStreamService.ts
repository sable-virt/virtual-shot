class MediaStreamService {
  getVideoStream(videoStreamId: string = '') {
    const constraints = {
      video: {
        deviceId: {
          exact: videoStreamId
        },
        width: {
          ideal: 960
        },
        height: {
          ideal: 640
        },
        frameRate: {
          ideal: 60,
          min: 20
        },
        facingMode: 'user',
      }
    }
    return navigator.mediaDevices.getUserMedia(constraints)
  }
}
export default new MediaStreamService()
