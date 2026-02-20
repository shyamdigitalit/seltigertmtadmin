import Router from './routes/Router';
import './App.css';
import { useSelector } from 'react-redux';

const App = () => {
  const { loading, user } = useSelector(state => state.auth);
  if (!loading) return <Router />;
};

export default App;
