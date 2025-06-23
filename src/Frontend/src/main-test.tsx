import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Simple test component
const TestApp = () => {
  return (
    <div style={{ padding: '20px', fontSize: '24px', color: 'blue' }}>
      <h1>🚀 React App Test</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert('React is working!')}>Click me!</button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)
