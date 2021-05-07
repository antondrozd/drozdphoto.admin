import { useEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Button, Menu, Modal, message } from 'antd'
import {
  AppstoreOutlined,
  PlusOutlined,
  DeleteTwoTone,
  DeleteOutlined,
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'

import API from '../../api'
import { fetchMenuItemsRequest } from '../../redux/menu/menu.actions'
import { selectMenuItems } from '../../redux/menu/menu.selectors'
import { showModal } from '../../redux/modal/modal.actions'

import './side-menu.styles.scss'

interface IProps {
  defaultActiveDropown?: string
  activePhotosetID?: string
}

const SideMenu = ({ defaultActiveDropown, activePhotosetID }: IProps) => {
  const defaultActiveDropowns = defaultActiveDropown ? [defaultActiveDropown] : []
  const defaultSelectedItems = activePhotosetID ? [activePhotosetID] : []

  const [activeDropowns, setActiveDropowns] = useState(defaultActiveDropowns)

  const menuItems = useSelector(selectMenuItems)
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    dispatch(fetchMenuItemsRequest())
  }, [dispatch])

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
      await API.deletePhotoset(id)
      message.success('Видалено')
      dispatch(fetchMenuItemsRequest())
      if (location.pathname.includes(id)) {
        history.push('/editor')
      }
    } catch (error) {
      console.error(error)
      message.error(error.message)
    }
  }

  return (
    <Menu
      openKeys={activeDropowns}
      onOpenChange={onOpenChange}
      selectedKeys={defaultSelectedItems}
      mode="inline"
      className="side-menu"
    >
      <Menu.SubMenu key="album" icon={<AppstoreOutlined />} title="Альбоми">
        {menuItems.album.map(({ label, routePath, id }) => {
          return (
            <Menu.Item key={id} className="side-menu-item">
              <DeleteTwoTone
                twoToneColor="#eb2f96"
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
            className="add-photoset-btn"
            onClick={() => dispatch(showModal('add-album'))}
          >
            Додати альбом
            <PlusOutlined className="add-photoset-icon" />
          </Button>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="serie" icon={<AppstoreOutlined />} title="Серії">
        {menuItems.serie.map(({ label, routePath, id }) => {
          return (
            <Menu.Item key={id} className="side-menu-item">
              <DeleteTwoTone
                twoToneColor="#eb2f96"
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
            className="add-photoset-btn"
            onClick={() => dispatch(showModal('add-serie'))}
          >
            Додати серію
            <PlusOutlined className="add-photoset-icon" />
          </Button>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  )
}

export default SideMenu
