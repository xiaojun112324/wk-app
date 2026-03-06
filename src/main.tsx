import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'
import './styles/index.css'
import App from './App.tsx'
import '@ant-design/v5-patch-for-react-19';
import './i18n';
import { LanguageProvider } from './contexts/LanguageProvider.tsx';
import { ConfigProvider, theme } from 'antd';



createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={{

    }}
    componentSize="middle"
  >
    <LanguageProvider>
      <App />
    </LanguageProvider>

  </ConfigProvider>,
)
