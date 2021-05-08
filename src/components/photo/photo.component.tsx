import { CSSProperties } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { message } from 'antd'
import { DeleteTwoTone, CrownTwoTone } from '@ant-design/icons'
import { RenderImageProps } from 'react-photo-gallery'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { removePhoto, setCover } from '../../redux/gallery/gallery.actions'
import { selectCoverImgSrc } from '../../redux/gallery/gallery.selectors'
import { IPhoto } from '../../interfaces/gallery.interfaces'

import 'react-lazy-load-image-component/src/effects/blur.css'
import './photo.styles.scss'

const Photo = ({ photo, margin, direction, top, left }: RenderImageProps<IPhoto>) => {
  const dispatch = useDispatch()

  const coverImgSrc = useSelector(selectCoverImgSrc)
  const isSelectedAsCover = coverImgSrc === photo.src

  // required by react-sortable-gallery
  let imgStyle: CSSProperties = { margin }
  if (direction === 'column') {
    imgStyle = { ...imgStyle, position: 'absolute', left, top }
  }

  const handleRemove = () => {
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
    <div className={`photo${isSelectedAsCover ? ' cover' : ''}`}>
      <DeleteTwoTone
        twoToneColor="#eb2f96"
        className="delete-icon"
        onClick={handleRemove}
      />
      <CrownTwoTone
        twoToneColor="#ffd700"
        className="select-cover-icon"
        onClick={() => handleCoverSelect(photo)}
      />
      <LazyLoadImage
        style={imgStyle}
        wrapperProps={{ style: { display: 'block' } }}
        width={photo.width}
        height={photo.height}
        src={photo.thumbSrc}
        placeholderSrc={photo.placeholderScr}
        effect="blur"
        className="photo-img"
      ></LazyLoadImage>
    </div>
  )
}

export default Photo
