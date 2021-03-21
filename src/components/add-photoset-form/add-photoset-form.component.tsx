import { Form, Input, FormInstance, message } from 'antd'
import { uid } from 'uid'

import { db } from '../../firebase'
import { PhotosetType } from '../../interfaces/common.interfaces'
import { PhotoSet } from '../../interfaces/gallery.interfaces'

interface IProps {
  formControlInstance: FormInstance
  photosetType: PhotosetType
  onFinish: ({
    photosetType,
    photosetID,
  }: {
    photosetType: PhotosetType
    photosetID: string
  }) => void
}

const AddPhotosetForm = ({ formControlInstance, photosetType, onFinish }: IProps) => {
  const onAdd = ({ label, descr }: { label: string; descr: string }) => {
    const photoset = new PhotoSet({ id: uid(), label, descr, type: photosetType })

    db.collection('sets')
      .doc(photoset.id)
      .set(Object.assign({}, photoset))
      .then(() => {
        message.success('Створено!')
        formControlInstance.resetFields()
        onFinish({ photosetType, photosetID: photoset.id })
      })
      .catch((error: Error) => message.error(error.message))
  }

  return (
    <Form form={formControlInstance} onFinish={onAdd}>
      <Form.Item
        rules={[{ required: true, message: 'Введіть назву' }]}
        name="label"
        label="Назва"
      >
        <Input />
      </Form.Item>
      <Form.Item name="descr" label="Опис">
        <Input.TextArea rows={3} />
      </Form.Item>
    </Form>
  )
}

export default AddPhotosetForm
