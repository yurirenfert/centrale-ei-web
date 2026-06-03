import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import AddMovie from './pages/AddMovie/AddMovie';
import Users from './pages/Users/Users';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import Dev from './pages/Dev/Dev';
import Search from './pages/Search/Search';
import Discover from './pages/Discover/Discover';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="discover" element={<Discover />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="movies/new" element={<AddMovie />} />
        <Route path="movies/:movieId" element={<MovieDetails />} />
        <Route path="users" element={<Users />} />
        <Route path="about" element={<About />} />
        <Route path="dev" element={<Dev />} />
      </Routes>
    </Layout>
  );
}

export default App;
