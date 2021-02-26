import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Menu } from 'antd'
import { AppstoreOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons'

import { useActivePhotosetData } from '../../hooks/custom.hooks'
import { fetchMenuItemsRequest } from '../../redux/menu/menu.actions'
import { selectMenuItems } from '../../redux/menu/menu.selectors'

const SideMenu = () => {
  const { albums, series } = useSelector(selectMenuItems)

  const {
    activePhotosetID: activePhotosetKey,
    activePhotosetType,
  } = useActivePhotosetData()
  const [activePhotosetTypeKeys, setActivePhotosetTypeKeys] = useState([
    `${activePhotosetType}s`,
  ])

  const dispatch = useDispatch()

  const onOpenChange = (openKeys: React.ReactText[]) => {
    setActivePhotosetTypeKeys(openKeys as string[])
  }

  useEffect(() => {
    dispatch(fetchMenuItemsRequest())
  }, [dispatch])

  return (
    <Menu
      openKeys={activePhotosetTypeKeys}
      onOpenChange={onOpenChange}
      selectedKeys={[activePhotosetKey]}
      mode="inline"
      style={{ height: '100%' }}
    >
      <Menu.SubMenu key="albums" icon={<AppstoreOutlined />} title="Альбоми">
        {albums.map(({ label, routePath, id }) => {
          return (
            <Menu.Item key={id}>
              <Link to={`/editor/album${routePath}`}>{label}</Link>
            </Menu.Item>
          )
        })}
        <Menu.Item key="add-album">
          <Button type="dashed" style={{ marginLeft: '-16px' }}>
            Додати альбом
            <PlusOutlined style={{ fontSize: 16, marginLeft: '10px', marginRight: 0 }} />
          </Button>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu key="series" icon={<AppstoreOutlined />} title="Серії">
        {series.map(({ label, routePath, id }) => {
          return (
            <Menu.Item key={id}>
              <Link to={`/editor/serie${routePath}`}>{label}</Link>
            </Menu.Item>
          )
        })}
        <Menu.Item key="add-serie">
          <Button type="dashed" style={{ marginLeft: '-16px' }}>
            Додати серію
            <PlusOutlined style={{ fontSize: 16, marginLeft: '10px', marginRight: 0 }} />
          </Button>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/settings">Налаштування</Link>
      </Menu.Item>
    </Menu>
  )
}

export default SideMenu
