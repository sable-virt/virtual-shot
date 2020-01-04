import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

interface Props {
  onInit?(info: MediaDeviceInfo | undefined): void;
  onChange?(info: MediaDeviceInfo | undefined): void;
  type?: 'videoinput' | 'audioinput' | 'audiooutput'
  errorMessage?: '-'
  deviceId: string | undefined
  disabled?: boolean
}

const MediaSelector: React.FC<Props> = props => {
  const {
    deviceId = 'deviceId',
    type = 'audioinput',
    disabled = false,
    errorMessage = '-',
    onInit,
    onChange
  } = props

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [currentDeviceId, setCurrentDeviceId] = useState<string>(deviceId)
  const _deviceTable: Map<string, MediaDeviceInfo> = useMemo( () => new Map(), [])
  const _handleOnLoadDevices = useCallback(async() => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const filteredDevices = devices.filter(device => {
      return (device.kind === type)
    })
    filteredDevices.forEach((device: MediaDeviceInfo) => {
      _deviceTable.set(device.deviceId, device)
    })
    let currentDeviceId = filteredDevices[0] ? filteredDevices[0].deviceId : 'default'
    const targetDevice = filteredDevices.find(device => {
      return device.deviceId === deviceId
    })
    if (targetDevice) {
      currentDeviceId = targetDevice.deviceId
    }
    setDevices(filteredDevices)
    setCurrentDeviceId(currentDeviceId)

    if (onInit) {
      onInit(_deviceTable.get(currentDeviceId))
    }
  }, [_deviceTable, type, deviceId, onInit])
  useEffect(() => {
    _handleOnLoadDevices()
  }, [_handleOnLoadDevices])
  useEffect(() => {
    setCurrentDeviceId(deviceId)
  }, [deviceId])
  const _handleOnChangeDevice = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value
    const deviceInfo = _deviceTable.get(deviceId)
    if (deviceInfo) {
      setCurrentDeviceId(deviceId)
      if (onChange) {
        onChange(deviceInfo)
      }
    } else if (onChange) {
      onChange(undefined)
    }
  }, [onChange, _deviceTable])

  const options = useMemo(() => {
    return devices.map((device: MediaDeviceInfo) => {
      return <option value={device.deviceId} key={device.deviceId}>{device.label}</option>
    })
  }, [devices])
  if (options.length === 0) {
    options.push(<option value="default" key={0}>{errorMessage}</option>)
  }
  return (
    <select value={currentDeviceId} onChange={_handleOnChangeDevice} disabled={disabled}>
      {options}
    </select>
  )
}
export default MediaSelector
