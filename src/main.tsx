import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'
import './styles/index.css'
import App from './App.tsx'
import '@ant-design/v5-patch-for-react-19';
import './i18n';
import { LanguageProvider } from './contexts/LanguageProvider.tsx';
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1c4fb4',
        colorSuccess: '#0ba56d',
        colorWarning: '#f5a524',
        colorError: '#cc3653',
        colorInfo: '#2a76d2',
        colorBgBase: '#f4f7fc',
        colorTextBase: '#0f1f38',
        colorBorder: '#d8e1f2',
        borderRadius: 10,
        fontFamily: 'IBM Plex Sans, Segoe UI, sans-serif',
        controlHeight: 42,
      },
      components: {
        Card: {
          borderRadiusLG: 12,
        },
        Input: {
          borderRadius: 10,
        },
        Button: {
          borderRadius: 10,
          controlHeight: 42,
        },
      },
    }}
    componentSize="middle"
  >
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </ConfigProvider>,
)

