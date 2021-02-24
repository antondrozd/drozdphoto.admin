import calculateRatio from 'calculate-aspect-ratio'
import promisifiedFileReader from 'promise-file-reader'

interface IRatio {
  width: number
  height: number
}

export const getAspectRatioFromImageFile = (imageFile: File): Promise<IRatio> => {
  return promisifiedFileReader.readAsDataURL(imageFile).then((imageData) => {
    const image = new Image()
    image.src = imageData

    return new Promise((resolve) => {
      image.onload = () => {
        const ratio = getAspectRatio(image.width, image.height)
        resolve(ratio)
      }
    })
  })
}

export const getAspectRatio = (w: number, h: number) => {
  const ratio = calculateRatio(w, h)
  const [width, height] = ratio.split(':')

  return {
    width: Math.round(Number(width)),
    height: Math.round(Number(height)),
  }
}
