// main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/App.css';
import './css/LandingPage.css'
import './css/BtnMain.css'
import './css/Copyright.css'
import './css/fonts.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div>Error: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <ErrorBoundary>
     <React.StrictMode>
        <App />
    </React.StrictMode>
  </ErrorBoundary>
);