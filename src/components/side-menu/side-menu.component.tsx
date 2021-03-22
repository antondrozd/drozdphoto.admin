import { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Menu, Modal, Form, message } from 'antd'
import {
  AppstoreOutlined,
  PlusOutlined,
  DeleteTwoTone,
  DeleteOutlined,
} from '@ant-design/icons'

import AddPhotosetForm from '../add-photoset-form/add-photoset-form.component'
import { db, deletePhotoset } from '../../firebase'
import { IPhotoSet } from '../../interfaces/gallery.interfaces'
import { IMenuItem } from '../../interfaces/menu.interface'

import './side-menu.styles.scss'

interface IProps {
  defaultActiveDropown: string
  activePhotosetID: string
}

const SideMenu = ({ defaultActiveDropown, activePhotosetID }: IProps) => {
  const [activeDropowns, setActiveDropowns] = useState([defaultActiveDropown])
  const [albumItems, setAlbumItems] = useState<IMenuItem[]>([])
  const [serieItems, setSerieItems] = useState<IMenuItem[]>([])

  const history = useHistory()

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = () => {
    db.collection('sets')
      .get()
      .then((snapshot) => {
        const items = {
          album: [] as IMenuItem[],
          serie: [] as IMenuItem[],
        }

        snapshot.docs.forEach((doc) => {
          const { routePath, label, id, type } = doc.data() as IPhotoSet

          items[type].push({ routePath, label, id })
        })

        setAlbumItems(items.album)
        setSerieItems(items.serie)
      })
      .catch(console.error)
  }

  const onOpenChange = (openKeys: React.ReactText[]) => {
    setActiveDropowns(openKeys as string[])
  }

  const onPhotosetDelete = (id: string) => {
    Modal.confirm({
      title: 'Ты что, сдурела?',
      icon: <DeleteOutlined style={{ color: 'red' }} />,
      content: 'Удалить фотосет и все фото?',
      onOk: async () => {
        await deletePhotoset(id)
        message.success('Видалено')
        fetchMenuItems()
      },
    })
  }

  const [addAlbumFormControlInstance] = Form.useForm()
  const [addSerieFormControlInstance] = Form.useForm()

  return (
    <Menu
      openKeys={activeDropowns}
      onOpenChange={onOpenChange}
      selectedKeys={[activePhotosetID]}
      mode="inline"
      style={{ height: '100%' }}
      className="side-menu"
    >
      <Menu.SubMenu key="album" icon={<AppstoreOutlined />} title="Альбоми">
        {albumItems.map(({ label, routePath, id }) => {
          return (
            <Menu.Item key={id} className="side-menu-item">
              <DeleteTwoTone
                twoToneColor="#eb2f96"
                style={{ fontSize: 21 }}
                className="delete-icon"
                onClick={() => onPhotosetDelete(id)}
              />
              <Link to={`/editor/album${routePath}`}>{label}</Link>
            </Menu.Item>
          )
        })}
        <Menu.Item key="add-album">
          <Button
            type="dashed"
            style={{ marginLeft: '-16px' }}
            onClick={() => {
              Modal.confirm({
                title: 'Додати альбом',
                content: (
                  <AddPhotosetForm
                    photosetType="album"
                    formControlInstance={addAlbumFormControlInstance}
                    onFinish={({ photosetType, photosetID }) => {
                      fetchMenuItems()
                      history.push(`/editor/${photosetType}/${photosetID}`)
                    }}
                  />
                ),
                okText: 'Додати',
                cancelText: 'Назад',
                onOk: () =>
                  addAlbumFormControlInstance.validateFields().then(() => {
                    addAlbumFormControlInstance.submit()
                  }),
              })
            }}
          >
            Додати альбом
            <PlusOutlined style={{ fontSize: 16, marginLeft: '10px', marginRight: 0 }} />
          </Button>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="serie" icon={<AppstoreOutlined />} title="Серії">
        {serieItems.map(({ label, routePath, id }) => {
          return (
            <Menu.Item key={id} className="side-menu-item">
              <DeleteTwoTone
                twoToneColor="#eb2f96"
                style={{ fontSize: 21 }}
                className="delete-icon"
                onClick={() => onPhotosetDelete(id)}
              />
              <Link to={`/editor/serie${routePath}`}>{label}</Link>
            </Menu.Item>
          )
        })}
        <Menu.Item key="add-serie">
          <Button
            type="dashed"
            style={{ marginLeft: '-16px' }}
            onClick={() => {
              Modal.confirm({
                title: 'Додати серію',
                content: (
                  <AddPhotosetForm
                    photosetType="serie"
                    formControlInstance={addSerieFormControlInstance}
                    onFinish={({ photosetType, photosetID }) => {
                      fetchMenuItems()
                      history.push(`/editor/${photosetType}/${photosetID}`)
                    }}
                  />
                ),
                okText: 'Додати',
                cancelText: 'Назад',
                onOk: () =>
                  addSerieFormControlInstance.validateFields().then(() => {
                    addSerieFormControlInstance.submit()
                  }),
              })
            }}
          >
            Додати серію
            <PlusOutlined style={{ fontSize: 16, marginLeft: '10px', marginRight: 0 }} />
          </Button>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  )
}

export default SideMenu
