import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Form } from 'antd'

import AddPhotosetForm from '../forms/add-photoset-form/add-photoset-form.component'
import { fetchMenuItemsRequest } from '../../redux/gallery/gallery.actions'
import { hideModal } from '../../redux/modal/modal.actions'
import { selectActiveModal } from '../../redux/modal/modal.selectors'

import { PhotosetType } from '../../interfaces/common.interfaces'

interface IProps {
  photosetType: PhotosetType
  visible: boolean
}

const AddPhotosetModal = ({ photosetType, visible }: IProps) => {
  // prettier-ignore
  const title =
    (
      (photosetType === PhotosetType.PORTFOLIO && 'Додати категорію') ||
      (photosetType === PhotosetType.SERIE && 'Додати серію')
    ) as string

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

  return (
    <AddPhotosetModal
      photosetType={PhotosetType.PORTFOLIO}
      visible={activeModal === 'add-portfolio-album'}
    />
  )
}

export const AddSerieModal = () => {
  const activeModal = useSelector(selectActiveModal)

  return (
    <AddPhotosetModal
      photosetType={PhotosetType.SERIE}
      visible={activeModal === 'add-serie-album'}
    />
  )
}

export default AddPhotosetModal
