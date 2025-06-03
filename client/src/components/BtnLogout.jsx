import React from 'react';
import { useNavigate } => 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import '../css/BtnLogout.css';

const BtnLogout = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/');
    }
  };

  return (
    <button className="btn-logout" onClick={handleLogout}>
      Sign Out
    </button>
  );
};

export default BtnLogout;
