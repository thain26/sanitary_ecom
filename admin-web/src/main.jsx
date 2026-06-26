import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider 
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#0f172a', // Slate 900 for dark premium theme colors
          borderRadius: 6,
          fontFamily: "'Inter', sans-serif",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
