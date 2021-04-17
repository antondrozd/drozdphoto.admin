import React, { CSSProperties } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { message } from 'antd'
import { DeleteTwoTone, CrownTwoTone } from '@ant-design/icons'
import { RenderImageProps } from 'react-photo-gallery'

import { removePhoto, setCover } from '../../redux/gallery/gallery.actions'
import { selectCoverImgSrc } from '../../redux/gallery/gallery.selectors'
import { IPhoto } from '../../interfaces/gallery.interfaces'

import './photo.styles.scss'

const Photo = ({ photo, margin, direction, top, left }: RenderImageProps) => {
  const dispatch = useDispatch()

  const coverImgSrc = useSelector(selectCoverImgSrc)
  const isSelectedAsCover = coverImgSrc === photo.src

  // required by react-sortable-gallery
  const imgStyle: CSSProperties = { margin: margin }
  if (direction === 'column') {
    imgStyle.position = 'absolute'
    imgStyle.left = left
    imgStyle.top = top
  }

  const handleRemove = () => {
    // @ts-ignore
    dispatch(removePhoto(photo))
    message.success('Фото видалено. Щоб зберегти зміни, натисніть "Зберегти"')

    if (photo.src === coverImgSrc) dispatch(setCover(null))
  }

  const handleCoverSelect = (photo: IPhoto) => {
    if (!isSelectedAsCover) {
      dispatch(setCover(photo.src))
    }
  }

  return (
    <div className={`photo ${isSelectedAsCover && 'cover'}`}>
      <DeleteTwoTone
        twoToneColor="#eb2f96"
        className="delete-icon"
        onClick={handleRemove}
      />
      <CrownTwoTone
        twoToneColor="#ffd700"
        className="select-cover-icon"
        // @ts-ignore
        onClick={() => handleCoverSelect(photo)}
      />
      {/* @ts-ignore */}
      <img style={imgStyle} {...photo} alt="img" className="photo-img" />
    </div>
  )
}

export default Photo
