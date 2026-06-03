import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import AddMovie from './pages/AddMovie/AddMovie';
import Users from './pages/Users/Users';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="movies/new" element={<AddMovie />} />
        <Route path="users" element={<Users />} />
        <Route path="about" element={<About />} />
      </Routes>
    </Layout>
  );
}

export default App;
