class DownloadService {
  _base64ToBlob(uri: string) {
    const parse = uri.slice(5).split(/[,;]/).pop()
    if (!parse) throw new Error('base64 parse error')
    const binStr = window.atob(parse)
    const l = binStr.length
    const array = new Uint8Array(l)
    for (let i = 0; i < l; i++) {
      array[i] = binStr.charCodeAt(i)
    }
    return new Blob([array], { type: parse[0] })
  }
  download(base64: string, filename: string = '') {
    const blob = this._base64ToBlob(base64)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename ? `${filename}.png` : `capture-${Date.now()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }
}

export default new DownloadService()
