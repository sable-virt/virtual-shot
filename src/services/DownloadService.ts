class DownloadService {
  download(url: string, filename: string = '') {
    const a = document.createElement('a')
    a.href = url
    a.download = filename ? `${filename}.png` : `capture-${Date.now()}.png`
    a.click()
  }
}
export default new DownloadService()
