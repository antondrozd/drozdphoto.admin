import { useParams } from 'react-router-dom'
import { Layout } from 'antd'

import SideMenu from '../../components/side-menu/side-menu.component'
import GalleryEditor from '../../components/gallery-editor/gallery-editor.component'

const { Sider, Content } = Layout

interface IRouteParams {
  photosetType: string | undefined
  id: string | undefined
}

const GalleryEditorPage = () => {
  const { photosetType, id } = useParams<IRouteParams>()

  const menuProps = {}

  if (photosetType && id) {
    Object.assign(menuProps, { defaultActiveDropown: photosetType, activePhotosetID: id })
  }

  return (
    <>
      <Sider>
        <SideMenu {...menuProps} />
      </Sider>
      <Content>{id ? <GalleryEditor photosetID={id} /> : <></>}</Content>
    </>
  )
}

export default GalleryEditorPage
