import { createRoot } from 'react-dom/client'
import './styles.scss'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import Layout from './Layout'
import { Provider } from 'react-redux'
import {store} from "./store/store.js"
import { ThemeProvider } from './context/ThemeSwitcher'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
)