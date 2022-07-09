import calculateRatio from 'calculate-aspect-ratio'
import promisifiedFileReader from 'promise-file-reader'
import Compressor from 'compressorjs'

import { IPortfolioAlbum, ISerieAlbum, IPhoto } from './interfaces/gallery.interfaces'

export class PortfolioAlbum implements IPortfolioAlbum {
  id: string
  label: string
  routePath: string
  type: 'portfolio-album'
  photos: IPhoto[]

  constructor({ id, label }: { id: string; label: string }) {
    this.id = id
    this.label = label
    this.routePath = `/${id}`
    this.type = 'portfolio-album'
    this.photos = []
  }
}

export class SerieAlbum implements ISerieAlbum {
  id: string
  label: string
  descr: string
  routePath: string
  coverImgSrc: string | null
  type: 'serie-album'
  category: string
  photos: IPhoto[]

  constructor({
    id,
    label,
    descr,
    category,
  }: {
    id: string
    label: string
    descr: string
    category: string
  }) {
    this.id = id
    this.label = label
    this.descr = descr || ''
    this.routePath = `/${id}`
    this.coverImgSrc = null
    this.type = 'serie-album'
    this.category = category
    this.photos = []
  }
}

interface IRatio {
  width: number
  height: number
}

export const getAspectRatioFromImageFile = async (imageFile: File) => {
  return promisifiedFileReader.readAsDataURL(imageFile).then((imageData) => {
    const image = new Image()
    image.src = imageData

    return new Promise<IRatio>((resolve) => {
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

export const compressPhoto = async (file: File | Blob) => {
  return new Promise<Blob>((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      success: resolve,
      error: reject,
    })
  })
}

export const createThumbnail = async (file: File | Blob) => {
  return new Promise<Blob>((resolve, reject) => {
    new Compressor(file, {
      quality: 1,
      maxWidth: 900,
      maxHeight: 900,
      success: resolve,
      error: reject,
    })
  })
}

export const createPlaceholder = async (file: File | Blob) => {
  return new Promise<Blob>((resolve, reject) => {
    new Compressor(file, {
      quality: 0.1,
      maxWidth: 300,
      maxHeight: 300,
      success: resolve,
      error: reject,
    })
  })
}
