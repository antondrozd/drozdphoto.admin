import { Switch, Route, Link, Redirect } from 'react-router-dom'
import { Layout } from 'antd'

import GalleryEditorPage from './pages/gallery-editor/gallery-editor.page'
import ModalDisplayer from './components/modals/modal-displayer/modal-displayer.component'

import logo from './assets/logo.png'
import './app.styles.scss'
import { PhotosetType } from './interfaces/common.interfaces'

const { Header } = Layout

const App = () => {
  return (
    <>
      <Layout>
        <Header className="header">
          <Link to="/editor">
            <img src={logo} alt="logo" className="logo" />
          </Link>
        </Header>
        <Layout>
          <Redirect exact from="/" to="/editor" />
          <Switch>
            <Route
              exact
              path={`/editor/:photosetType(${PhotosetType.PORTFOLIO}|${PhotosetType.SERIE})?/:id?`}
              component={GalleryEditorPage}
            />
            <Route path="*" render={() => <>404</>}></Route>
          </Switch>
        </Layout>
      </Layout>
      <ModalDisplayer />
    </>
  )
}

export default App
