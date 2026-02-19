import Router from './routes/Router';
import './App.css';
import { useSelector } from 'react-redux';

const App = () => {
  const { loading, user } = useSelector(state => state.auth);
  console.log(user);

  if (!loading) return <Router />;
};

export default App;
