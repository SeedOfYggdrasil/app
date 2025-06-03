import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import EditorPage from './pages/EditorPage';
import LoadingSpinner from './components/LoadingSpinner';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (loadingAuth) {
    return <LoadingSpinner message="Checking authentication status..." />;
  }

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          
          <Route 
            path='/editor' 
            element={currentUser ? <EditorPage /> : <Navigate to="/" replace />} 
          />
          
          <Route 
            path='/dashboard' 
            element={currentUser ? <Dashboard /> : <Navigate to="/" replace />} 
          />
          
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
