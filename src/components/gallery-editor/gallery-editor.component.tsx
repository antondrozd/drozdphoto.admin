import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Upload, Button, Spin, Empty } from 'antd'
import { PlusOutlined, RedoOutlined, LoadingOutlined } from '@ant-design/icons'
import arrayMove from 'array-move'
import _ from 'lodash'

import SortableGallery from '../sortable-gallery/sortable-gallery.component'
import {
  selectPhotos,
  selectIsEdited,
  selectIsLoading,
} from '../../redux/gallery/gallery.selectors'
import {
  clearGallery,
  fetchPhotosRequest,
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
  const isEdited = useSelector(selectIsEdited)
  const isLoading = useSelector(selectIsLoading)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPhotosRequest(photosetID))
  }, [dispatch, photosetID])

  const uploadRequest = ({ file }: { file: File }) =>
    dispatch(uploadPhotoRequest(photosetID, file))

  const onSortStart = () => document.body.classList.add('grabbing') // needed to enable grabbing cursor

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const photosWithNewOrder = arrayMove(photos, oldIndex, newIndex)

    if (!_.isEqual(photosWithNewOrder, photos)) {
      dispatch(reorderPhotos(photosWithNewOrder))
    }

    document.body.classList.remove('grabbing') // needed to disable grabbing cursor
  }

  const onRefresh = () => dispatch(fetchPhotosRequest(photosetID))

  const onSave = () => dispatch(saveEditedRequest(photosetID, photos))

  const onClear = () => dispatch(clearGallery())

  return (
    <>
      <Spin spinning={isLoading} indicator={<LoadingOutlined />}>
        {!_.isEmpty(photos) ? (
          <SortableGallery
            photos={photos}
            onSortStart={onSortStart}
            onSortEnd={onSortEnd}
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
        showUploadList={false}
        accept="image/png, image/jpeg"
        height={80}
      >
        <PlusOutlined />
      </Dragger>
      <div className="controls">
        <Button shape="round" disabled={!isEdited} onClick={onSave}>
          Зберегти
        </Button>
        <Button shape="circle" disabled={!isEdited} onClick={onRefresh}>
          <RedoOutlined />
        </Button>
        <Button danger shape="round" disabled={_.isEmpty(photos)} onClick={onClear}>
          Очистити галерею
        </Button>
      </div>
    </>
  )
}

export default GalleryEditor
