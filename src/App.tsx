import { Switch, Route, Link } from 'react-router-dom'
import { Layout } from 'antd'

import GalleryEditorPage from './pages/gallery-editor/gallery-editor.page'

import logo from './assets/logo.png'

const { Header } = Layout

const App = () => {
  return (
    <Layout>
      <Header style={{ backgroundColor: '#fff' }}>
        <Link to="/editor">
          <img src={logo} alt="logo" style={{ height: '40px' }} />
        </Link>
      </Header>
      <Layout>
        <Switch>
          <Route path="/editor/:photosetType?/:id?" component={GalleryEditorPage} />
        </Switch>
      </Layout>
    </Layout>
  )
}

export default App
