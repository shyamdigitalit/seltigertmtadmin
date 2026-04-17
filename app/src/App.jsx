import Router from './routes/Router';
import './App.css';
import { useSelector } from 'react-redux';
import axiosInstance from './config/axiosInstance';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const { loading } = useSelector(state => state.auth);
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await axiosInstance.post('/auth/refresh-token');
        const token = res.data.data;

        store.dispatch({
          type: 'auth/setAccessToken',
          payload: token,
        });

        // 🔥 restart timer after reload
        startSessionTimer(store, axiosInstance);

      } catch (err) {
        store.dispatch({ type: 'auth/logout' });
      }
    };

    initSession();
  }, []);
  
  if (!loading) return <Router />;
};

export default App;
