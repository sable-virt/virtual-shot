import { useCallback, useEffect, useState } from 'react'
import MediaStreamService from './services/MediaStreamService'

export const useApp = () => {
  const [initialized, setInitialized] = useState(false)
  const [available, setAvailable] = useState(false)
  const _initialLoadDevice = useCallback(async() => {
    try {
      const result = await MediaStreamService.checkVideoStream()
      setAvailable(result)
    } catch(e) {
      alert(e)
      setAvailable(false)
    } finally {
      setInitialized(true)
    }
  }, [])
  const _loadDevice = useCallback(async (deviceId: string) => {
    return MediaStreamService.getVideoStream(deviceId)
  }, [])
  useEffect(() => {
    _initialLoadDevice()
  }, [_initialLoadDevice])
  return {
    initialized,
    available,
    loadDevice: _loadDevice
  }
}