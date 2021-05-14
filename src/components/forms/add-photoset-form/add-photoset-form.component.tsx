import { useSelector } from 'react-redux'
import { Form, Input, Select, FormInstance, message } from 'antd'
import { uid } from 'uid'

import { selectCategories } from '../../../redux/gallery/gallery.selectors'
import API from '../../../api'
import { PortfolioAlbum, SerieAlbum } from '../../../utils'

import { PhotosetType } from '../../../interfaces/common.interfaces'
import { IPhotoset } from '../../../interfaces/gallery.interfaces'

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
  const categories = useSelector(selectCategories)

  const onAdd = async ({
    label,
    descr,
    category,
  }: {
    label: string
    descr: string
    category: string
  }) => {
    // prettier-ignore
    const photoset = 
      (
        (photosetType === 'portfolio-album' && new PortfolioAlbum({ id: uid(), label })) ||
        (photosetType === 'serie-album' && new SerieAlbum({ id: uid(), label, descr, category }))
      ) as IPhotoset

    try {
      await API.addPhotoset(Object.assign({}, photoset)) // needed because firebase don't accept custom objects
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
      {photosetType === 'serie-album' && (
        <>
          <Form.Item
            rules={[{ required: true, message: 'Оберіть категорію' }]}
            name="category"
            label="Категорія"
          >
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Search to Select"
              optionFilterProp="children"
              // filterOption={(input, option) =>
              //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              // }
              // filterSort={(optionA, optionB) =>
              //   optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              // }
            >
              {categories.map((category) => (
                <Select.Option value={category} key={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="descr" label="Опис">
            <Input.TextArea rows={3} />
          </Form.Item>
        </>
      )}
    </Form>
  )
}

export default AddPhotosetForm
