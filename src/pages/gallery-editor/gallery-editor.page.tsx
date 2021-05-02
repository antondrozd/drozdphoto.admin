import { useParams, useHistory } from 'react-router-dom'
import { Layout } from 'antd'

import SideMenu from '../../components/side-menu/side-menu.component'
import GalleryEditor from '../../components/gallery-editor/gallery-editor.component'

const { Sider, Content } = Layout

interface IRouteParams {
  photosetType?: string
  id?: string
}

const GalleryEditorPage = () => {
  const { photosetType, id } = useParams<IRouteParams>()
  const history = useHistory()

  if ((id && !photosetType) || (!id && photosetType)) {
    history.push('/editor')
  }

  return (
    <>
      <Sider>
        <SideMenu defaultActiveDropown={photosetType} activePhotosetID={id} />
      </Sider>
      <Content>{id ? <GalleryEditor photosetID={id} /> : <>Оберіть фотосет</>}</Content>
    </>
  )
}

export default GalleryEditorPage
