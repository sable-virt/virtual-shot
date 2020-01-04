import React, { ChangeEvent, useCallback } from 'react'
interface Props {
  onChange: (img: HTMLImageElement | null) => void
}
const readImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result as string)
    })
    reader.addEventListener('error', (e) => {
      reject(e)
    })
    reader.readAsDataURL(file)
  })
}
const ImageInput: React.FC<Props> = props => {
  const {
    onChange
  } = props
  const _handleOnChange = useCallback(async(e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const url = await readImage(e.target.files[0])
      const image = new Image()
      image.src = url
      if (image.complete) {
        onChange(image)
      } else {
        image.addEventListener('load', () => {
          onChange(image)
        })
      }
    } else {
      onChange(null)
    }
  }, [onChange])
  return (
    <input
      type="file"
      accept="image/*"
      onChange={_handleOnChange}
    />
  )
}
export default ImageInput
