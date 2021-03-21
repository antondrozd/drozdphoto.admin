import { useParams } from 'react-router-dom'
import { Layout } from 'antd'

import SideMenu from '../../components/side-menu/side-menu.component'
import GalleryEditor from '../../components/gallery-editor/gallery-editor.component'

const { Sider, Content } = Layout

interface IParams {
  photosetType: string
  id: string
}

const GalleryEditorPage = () => {
  const { photosetType, id } = useParams<IParams>()

  return (
    <>
      <Sider>
        <SideMenu defaultActiveDropown={photosetType} activePhotosetID={id} />
      </Sider>
      <Content>
        <GalleryEditor photosetID={id} />
      </Content>
    </>
  )
}

export default GalleryEditorPage
