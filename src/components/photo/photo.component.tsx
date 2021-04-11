import React, { CSSProperties } from 'react'
import { useDispatch } from 'react-redux'
import { message } from 'antd'
import { DeleteTwoTone } from '@ant-design/icons'
import { RenderImageProps } from 'react-photo-gallery'

import { removePhoto } from '../../redux/gallery/gallery.actions'

import './photo.styles.scss'

const Photo = ({ photo, margin, direction, top, left }: RenderImageProps) => {
  const dispatch = useDispatch()

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
  }

  return (
    <div className="photo">
      <DeleteTwoTone
        twoToneColor="#eb2f96"
        style={{ fontSize: 26 }}
        className="delete-icon"
        onClick={handleRemove}
      />
      {/* @ts-ignore */}
      <img style={imgStyle} {...photo} alt="img" className="photo-img" />
    </div>
  )
}

export default Photo
