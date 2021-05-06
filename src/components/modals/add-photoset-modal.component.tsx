import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Form } from 'antd'

import AddPhotosetForm from '../forms/add-photoset-form/add-photoset-form.component'
import { fetchMenuItemsRequest } from '../../redux/menu/menu.actions'
import { hideModal } from '../../redux/modal/modal.actions'
import { selectActiveModal } from '../../redux/modal/modal.selectors'

import { PhotosetType } from '../../interfaces/common.interfaces'

interface IProps {
  photosetType: PhotosetType
  visible: boolean
}

const AddPhotosetModal = ({ photosetType, visible }: IProps) => {
  const title =
    (photosetType === 'album' && 'Додати альбом') ||
    (photosetType === 'serie' && 'Додати серію')

  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const history = useHistory()

  return (
    <Modal
      title={title}
      visible={visible}
      okText="Додати"
      cancelText="Назад"
      confirmLoading={confirmLoading}
      onOk={() =>
        form.validateFields().then(() => {
          form.submit()
          setConfirmLoading(true)
        })
      }
      onCancel={() => dispatch(hideModal())}
    >
      <AddPhotosetForm
        photosetType={photosetType}
        form={form}
        onFinish={({ photosetType, photosetID }) => {
          setConfirmLoading(false)
          dispatch(hideModal())
          dispatch(fetchMenuItemsRequest())
          history.push(`/editor/${photosetType}/${photosetID}`)
        }}
      />
    </Modal>
  )
}

export const AddAlbumModal = () => {
  const activeModal = useSelector(selectActiveModal)

  return <AddPhotosetModal photosetType="album" visible={activeModal === 'add-album'} />
}

export const AddSerieModal = () => {
  const activeModal = useSelector(selectActiveModal)

  return <AddPhotosetModal photosetType="serie" visible={activeModal === 'add-serie'} />
}

export default AddPhotosetModal
