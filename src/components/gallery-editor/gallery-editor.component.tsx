import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Upload, Button, Spin, Empty, message } from 'antd'
import { PlusOutlined, RedoOutlined, LoadingOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/lib/upload'
import arrayMove from 'array-move'
import _ from 'lodash'

import SortableGallery from '../sortable-gallery/sortable-gallery.component'
import {
  selectPhotos,
  selectIsEdited,
  selectIsLoading,
  selectCoverImgSrc,
} from '../../redux/gallery/gallery.selectors'
import {
  clearGallery,
  fetchPhotosetDataRequest,
  reorderPhotos,
  saveEditedRequest,
  uploadPhotoRequest,
} from '../../redux/gallery/gallery.actions'

import './gallery-editor.styles.scss'

const { Dragger } = Upload

interface IProps {
  photosetID: string
}

const GalleryEditor = ({ photosetID }: IProps) => {
  const photos = useSelector(selectPhotos)
  const coverImgSrc = useSelector(selectCoverImgSrc)
  const isEdited = useSelector(selectIsEdited)
  const isLoading = useSelector(selectIsLoading)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPhotosetDataRequest(photosetID))
  }, [dispatch, photosetID])

  const uploadRequest = ({ file }: { file: File }) =>
    dispatch(uploadPhotoRequest(photosetID, file))

  const handleSortStart = () => document.body.classList.add('grabbing') // needed to enable grabbing cursor

  const handleSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number
    newIndex: number
  }) => {
    const photosWithNewOrder = arrayMove(photos, oldIndex, newIndex)

    if (!_.isEqual(photosWithNewOrder, photos)) {
      dispatch(reorderPhotos(photosWithNewOrder))
    }

    document.body.classList.remove('grabbing') // needed to disable grabbing cursor
  }

  const handleRefresh = () => dispatch(fetchPhotosetDataRequest(photosetID))

  const handleSave = () =>
    dispatch(saveEditedRequest(photosetID, { photos, coverImgSrc }))

  const handleClear = () => dispatch(clearGallery())

  const checkFileSize = (file: RcFile, _: RcFile[]) => {
    const isSmallerThan2MB = file.size / 1024 / 1024 < 2

    if (!isSmallerThan2MB) {
      message.error(
        `Не вдалося завантажити ${file.name}. Фото повинно бути не більшим, ніж 2MB!`
      )
    }

    return isSmallerThan2MB
  }

  return (
    <div className="gallery-editor">
      <Spin
        spinning={isLoading}
        indicator={<LoadingOutlined />}
        wrapperClassName="content"
      >
        {!_.isEmpty(photos) ? (
          <SortableGallery
            photos={photos}
            onSortStart={handleSortStart}
            onSortEnd={handleSortEnd}
            distance={1}
            axis={'xy'}
          />
        ) : (
          !isLoading && (
            <Empty description="Немає фото" style={{ padding: '10px 20px' }} />
          )
        )}
      </Spin>

      <Dragger
        name="file"
        multiple={true}
        customRequest={uploadRequest}
        beforeUpload={checkFileSize}
        showUploadList={false}
        accept="image/png, image/jpeg"
        height={80}
      >
        <PlusOutlined />
      </Dragger>
      <div className="controls">
        <Button
          className="control-btn"
          danger
          shape="round"
          disabled={_.isEmpty(photos)}
          onClick={handleClear}
        >
          Очистити галерею
        </Button>
        <Button
          className="control-btn"
          shape="circle"
          disabled={!isEdited}
          onClick={handleRefresh}
        >
          <RedoOutlined />
        </Button>
        <Button
          className="control-btn"
          shape="round"
          disabled={!isEdited}
          onClick={handleSave}
        >
          Зберегти
        </Button>
      </div>
    </div>
  )
}

export default GalleryEditor
