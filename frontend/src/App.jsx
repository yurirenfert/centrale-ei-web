import { Navigate, Route, Routes } from 'react-router-dom';
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
import RatingOnboarding from './pages/RatingOnboarding/RatingOnboarding';
import DevUsers from './pages/Dev/DevUsers';

function OnboardingGate({ children }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const mustRateMovies =
    currentUser &&
    localStorage.getItem('ratingOnboardingUserId') === String(currentUser.id);

  if (mustRateMovies) {
    return (
      <Navigate
        to="/rating-onboarding"
        replace
        state={{
          userId: currentUser.id,
          displayName: currentUser.nickname,
        }}
      />
    );
  }

  return children;
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/dev/users" element={<DevUsers />} />
        <Route
          path="/"
          element={
            <OnboardingGate>
              <Home />
            </OnboardingGate>
          }
        />
        <Route
          path="search"
          element={
            <OnboardingGate>
              <Search />
            </OnboardingGate>
          }
        />
        <Route
          path="discover"
          element={
            <OnboardingGate>
              <Discover />
            </OnboardingGate>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="rating-onboarding" element={<RatingOnboarding />} />
        <Route
          path="movies/new"
          element={
            <OnboardingGate>
              <AddMovie />
            </OnboardingGate>
          }
        />
        <Route
          path="movies/:movieId"
          element={
            <OnboardingGate>
              <MovieDetails />
            </OnboardingGate>
          }
        />
        <Route
          path="users"
          element={
            <OnboardingGate>
              <Users />
            </OnboardingGate>
          }
        />
        <Route
          path="about"
          element={
            <OnboardingGate>
              <About />
            </OnboardingGate>
          }
        />
        <Route
          path="dev"
          element={
            <OnboardingGate>
              <Dev />
            </OnboardingGate>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
