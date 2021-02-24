import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Upload, Button, Spin, Modal } from 'antd'
import {
  PlusOutlined,
  RedoOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
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
const { confirm } = Modal

const GalleryEditor = () => {
  const photos = useSelector(selectPhotos)
  const isEdited = useSelector(selectIsEdited)
  const isLoading = useSelector(selectIsLoading)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPhotosRequest())
  }, [dispatch])

  const uploadRequest = ({ file }: { file: File }) => dispatch(uploadPhotoRequest(file))

  const onSortStart = () => document.body.classList.add('grabbing')

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const photosWithNewOrder = arrayMove(photos, oldIndex, newIndex)

    if (!_.isEqual(photosWithNewOrder, photos)) {
      dispatch(reorderPhotos(photosWithNewOrder))
    }

    document.body.classList.remove('grabbing')
  }

  const onRefresh = () => dispatch(fetchPhotosRequest())

  const onSave = () => dispatch(saveEditedRequest(photos))

  const onClear = () => {
    confirm({
      title: 'Ты что, сдурела?',
      icon: <DeleteOutlined style={{ color: 'red' }} />,
      content: 'Удалить все фото?',
      onOk() {
        dispatch(clearGallery())
      },
    })
  }

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
          !isLoading && 'Gallery is empty'
        )}
      </Spin>
      <Dragger
        name="file"
        multiple={true}
        customRequest={uploadRequest}
        showUploadList={false}
        accept="image/png, image/jpeg"
      >
        <PlusOutlined />
      </Dragger>
      <Button type="primary" shape="round" disabled={!isEdited} onClick={onSave}>
        Save
      </Button>
      <Button type="primary" shape="circle" disabled={!isEdited} onClick={onRefresh}>
        <RedoOutlined />
      </Button>
      <Button danger shape="round" disabled={_.isEmpty(photos)} onClick={onClear}>
        Clear gallery
      </Button>
    </>
  )
}

export default GalleryEditor
