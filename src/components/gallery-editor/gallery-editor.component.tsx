import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Upload, Button, Spin, Empty, message } from 'antd'
import { PlusOutlined, RedoOutlined, LoadingOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/lib/upload'
import arrayMove from 'array-move'
import _ from 'lodash'

import RouteLeavingProtector from '../route-leaving-protector/route-leaving-protector.component'
import SortableGallery from '../sortable-gallery/sortable-gallery.component'
import {
  selectPhotos,
  selectIsEdited,
  selectIsLoading,
  selectCoverImgSrc,
  selectIsRequestedPhotosetPresent,
  selectPhotosToDelete,
} from '../../redux/gallery/gallery.selectors'
import {
  clearGallery,
  fetchPhotosetDataRequest,
  reorderPhotos,
  saveEditedRequest,
  uploadPhotoRequest,
  setNoPhotosetSelected,
} from '../../redux/gallery/gallery.actions'

import './gallery-editor.styles.scss'

const { Dragger } = Upload

interface IProps {
  photosetID?: string
}

const GalleryEditor = ({ photosetID }: IProps) => {
  const photos = useSelector(selectPhotos)
  const coverImgSrc = useSelector(selectCoverImgSrc)
  const photosToDelete = useSelector(selectPhotosToDelete)
  const isEdited = useSelector(selectIsEdited)
  const isLoading = useSelector(selectIsLoading)
  const isPhotosetPresent = useSelector(selectIsRequestedPhotosetPresent)

  const dispatch = useDispatch()

  useEffect(() => {
    photosetID
      ? dispatch(fetchPhotosetDataRequest(photosetID))
      : dispatch(setNoPhotosetSelected())
  }, [dispatch, photosetID])

  const uploadRequest = ({ file }: { file: File }) =>
    dispatch(uploadPhotoRequest(photosetID as string, file))

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

  const handleRefresh = () => dispatch(fetchPhotosetDataRequest(photosetID as string))

  const handleSave = () =>
    dispatch(
      saveEditedRequest(photosetID as string, { photos, coverImgSrc, photosToDelete })
    )

  const handleClear = () => dispatch(clearGallery())

  const checkFileSize = (file: RcFile) => {
    const maxSizeMB = 20
    const isValid = file.size / 1024 / 1024 < maxSizeMB

    if (!isValid) {
      message.error(
        `Не вдалося завантажити ${file.name}. Фото повинно бути не більшим, ніж ${maxSizeMB}MB!`
      )
    }

    return isValid
  }

  return (
    <RouteLeavingProtector
      when={isEdited}
      modalConfig={{
        title: 'Ви впевнені?',
        content: 'Незбережені зміни буде втрачено.',
        okText: 'Перейти до іншої галереї',
        cancelText: 'Назад',
      }}
    >
      <div className="gallery-editor">
        {photosetID ? (
          isPhotosetPresent ? (
            <>
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
                  multiple
                  //@ts-ignore
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
            </>
          ) : (
            <>Фотосет не знайдено</>
          )
        ) : (
          <>Оберіть фотосет</>
        )}
      </div>
    </RouteLeavingProtector>
  )
}

export default GalleryEditor
