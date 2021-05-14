import { useParams, useHistory } from 'react-router-dom'
import { Layout } from 'antd'

import SideMenu from '../../components/side-menu/side-menu.component'
import GalleryEditor from '../../components/gallery-editor/gallery-editor.component'

import { PhotosetType } from '../../interfaces/common.interfaces'

import './gallery-editor-page.styles.scss'

const { Sider, Content } = Layout

interface IRouteParams {
  photosetType?: PhotosetType
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
      <Sider collapsible width={235} className="sider">
        <SideMenu defaultActiveDropown={photosetType} activePhotosetID={id} />
      </Sider>
      <Content>
        <GalleryEditor photosetID={id} />
      </Content>
    </>
  )
}

export default GalleryEditorPage
