import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Menu } from 'antd'
import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons'

import { db } from '../../firebase'
import { IPhotoSet } from '../../interfaces/gallery.interfaces'
import { IMenuItem } from '../../interfaces/menu.interface'

interface IProps {
  defaultActiveDropown: string
  activePhotosetID: string
}

const SideMenu = ({ defaultActiveDropown, activePhotosetID }: IProps) => {
  const [activeDropowns, setActiveDropowns] = useState([defaultActiveDropown])
  const [albumItems, setAlbumItems] = useState<IMenuItem[]>([])
  const [serieItems, setSerieItems] = useState<IMenuItem[]>([])

  useEffect(() => {
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
  }, [])

  const onOpenChange = (openKeys: React.ReactText[]) => {
    setActiveDropowns(openKeys as string[])
  }

  return (
    <Menu
      openKeys={activeDropowns}
      onOpenChange={onOpenChange}
      selectedKeys={[activePhotosetID]}
      mode="inline"
      style={{ height: '100%' }}
    >
      <Menu.SubMenu key="album" icon={<AppstoreOutlined />} title="Альбоми">
        {albumItems.map(({ label, routePath, id }) => {
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
      <Menu.SubMenu key="serie" icon={<AppstoreOutlined />} title="Серії">
        {serieItems.map(({ label, routePath, id }) => {
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
    </Menu>
  )
}

export default SideMenu
