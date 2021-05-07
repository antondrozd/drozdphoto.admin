import { Form, Input, FormInstance, message } from 'antd'
import { uid } from 'uid'

import API from '../../../api'
import { PhotosetType } from '../../../interfaces/common.interfaces'
import { PhotoSet } from '../../../interfaces/gallery.interfaces'

interface IProps {
  form: FormInstance
  photosetType: PhotosetType
  onFinish: ({
    photosetType,
    photosetID,
  }: {
    photosetType: PhotosetType
    photosetID: string
  }) => void
}

const AddPhotosetForm = ({ form, photosetType, onFinish }: IProps) => {
  const onAdd = async ({ label, descr }: { label: string; descr: string }) => {
    const photoset = Object.assign(
      {},
      new PhotoSet({ id: uid(), label, descr, type: photosetType })
    ) // needed because firebase don't accept custom objects

    try {
      await API.addPhotoset(photoset)
      message.success('Створено!')
      form.resetFields()
      onFinish({ photosetType, photosetID: photoset.id })
    } catch (error) {
      message.error(error.message)
    }
  }

  return (
    <Form form={form} onFinish={onAdd}>
      <Form.Item
        rules={[{ required: true, whitespace: true, message: 'Введіть назву' }]}
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
