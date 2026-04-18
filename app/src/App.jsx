import Router from './routes/Router';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from './config/axiosInstance';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSession } from './redux/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(checkSession());
  }, []);
  const { loading } = useSelector(state => state.auth);
  if (!loading) return <Router />;
};

export default App;
