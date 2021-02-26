import { Switch, Route, Link } from 'react-router-dom'
import { Layout } from 'antd'

import SideMenu from './components/side-menu/side-menu.component'
import GalleryEditor from './components/gallery-editor/gallery-editor.component'

import logo from './assets/logo.png'

const { Header, Sider, Content } = Layout

const App = () => {
  return (
    <Layout>
      <Header style={{ backgroundColor: '#fff' }}>
        <Link to="/">
          <img src={logo} alt="logo" style={{ height: '40px' }} />
        </Link>
      </Header>
      <Layout>
        <Sider>
          <SideMenu />
        </Sider>
        <Content>
          <Switch>
            <Route path="/editor" component={GalleryEditor}></Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
