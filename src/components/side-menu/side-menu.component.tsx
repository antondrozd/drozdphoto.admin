import { useEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
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
  defaultActiveDropown?: string
  activePhotosetID?: string
}

interface IMenuItems {
  album: IMenuItem[]
  serie: IMenuItem[]
}

const styles = {
  addPhotosetButton: { marginLeft: '-16px' },
  addPhotosetIcon: { fontSize: 16, marginLeft: '10px', marginRight: 0 },
  deletePhotosetIcon: { fontSize: 21 },
}

const SideMenu = ({ defaultActiveDropown, activePhotosetID }: IProps) => {
  const defaultActiveDropowns = defaultActiveDropown ? [defaultActiveDropown] : []
  const defaultSelectedItems = activePhotosetID ? [activePhotosetID] : []

  const [activeDropowns, setActiveDropowns] = useState(defaultActiveDropowns)

  const [menuItems, setMenuItems] = useState<IMenuItems>({ album: [], serie: [] })

  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = () => {
    db.collection('sets')
      .get()
      .then((snapshot) => {
        const items: IMenuItems = {
          album: [],
          serie: [],
        }

        snapshot.docs.forEach((doc) => {
          const { routePath, label, id, type } = doc.data() as IPhotoSet

          items[type].push({ routePath, label, id })
        })

        setMenuItems(items)
      })
      .catch(console.error)
  }

  const onOpenChange = (openKeys: React.ReactText[]) => {
    setActiveDropowns(openKeys as string[])
  }

  const onPhotosetDeleteRequest = (id: string, label: string) => {
    Modal.confirm({
      title: 'Ви впевнені?',
      content: `Видалити фотосет "${label}"?`,
      icon: <DeleteOutlined style={{ color: 'red' }} />,
      okText: 'Видалити',
      cancelText: 'Назад',
      onOk: () => onPhotosetDeleteConfirm(id),
    })
  }

  const onPhotosetDeleteConfirm = async (id: string) => {
    try {
      await deletePhotoset(id)
      message.success('Видалено')
      fetchMenuItems()
      if (location.pathname.includes(id)) {
        history.push('/editor')
      }
    } catch (error) {
      console.error(error)
      message.error(error.message)
    }
  }

  const showAddAlbumModal = () => {
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
  }

  const showAddSerieModal = () => {
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
  }

  const [addAlbumFormControlInstance] = Form.useForm()
  const [addSerieFormControlInstance] = Form.useForm()

  return (
    <Menu
      openKeys={activeDropowns}
      onOpenChange={onOpenChange}
      selectedKeys={defaultSelectedItems}
      mode="inline"
      style={{ height: '100%' }}
      className="side-menu"
    >
      <Menu.SubMenu key="album" icon={<AppstoreOutlined />} title="Альбоми">
        {menuItems.album.map(({ label, routePath, id }) => {
          return (
            <Menu.Item key={id} className="side-menu-item">
              <DeleteTwoTone
                twoToneColor="#eb2f96"
                style={styles.deletePhotosetIcon}
                className="delete-icon"
                onClick={() => onPhotosetDeleteRequest(id, label)}
              />
              <Link to={`/editor/album${routePath}`} title={label}>
                {label}
              </Link>
            </Menu.Item>
          )
        })}
        <Menu.Item key="add-album">
          <Button
            type="dashed"
            style={styles.addPhotosetButton}
            onClick={showAddAlbumModal}
          >
            Додати альбом
            <PlusOutlined style={styles.addPhotosetIcon} />
          </Button>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="serie" icon={<AppstoreOutlined />} title="Серії">
        {menuItems.serie.map(({ label, routePath, id }) => {
          return (
            <Menu.Item key={id} className="side-menu-item">
              <DeleteTwoTone
                twoToneColor="#eb2f96"
                style={styles.deletePhotosetIcon}
                className="delete-icon"
                onClick={() => onPhotosetDeleteRequest(id, label)}
              />
              <Link to={`/editor/serie${routePath}`} title={label}>
                {label}
              </Link>
            </Menu.Item>
          )
        })}
        <Menu.Item key="add-serie">
          <Button
            type="dashed"
            style={styles.addPhotosetButton}
            onClick={showAddSerieModal}
          >
            Додати серію
            <PlusOutlined style={styles.addPhotosetIcon} />
          </Button>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  )
}

export default SideMenu
