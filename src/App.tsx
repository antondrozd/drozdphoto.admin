import { Switch, Route, Link } from 'react-router-dom'
import { Layout } from 'antd'

import GalleryEditorPage from './pages/gallery-editor/gallery-editor.page'

import logo from './assets/logo.png'
import './app.styles.scss'

const { Header } = Layout

const App = () => {
  return (
    <Layout>
      <Header className="header">
        <Link to="/editor">
          <img src={logo} alt="logo" className="logo" />
        </Link>
      </Header>
      <Layout>
        <Switch>
          <Route
            exact
            path="/editor/:photosetType(album|serie)?/:id?"
            component={GalleryEditorPage}
          />
          <Route path="*" render={() => <>404</>}></Route>
        </Switch>
      </Layout>
    </Layout>
  )
}

export default App
