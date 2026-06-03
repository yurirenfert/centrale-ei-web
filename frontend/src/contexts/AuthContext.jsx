import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [ratingsByMovieId, setRatingsByMovieId] = useState({});

  const loadRatings = (userId) => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/ratings`, {
        params: { user_id: userId },
      })
      .then((response) => {
        const nextRatingsByMovieId = {};

        for (const rating of response.data.ratings) {
          nextRatingsByMovieId[rating.movie_id] = rating.rating_value;
        }

        setRatingsByMovieId(nextRatingsByMovieId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const login = (user) => {
    setCurrentUser(user);
    loadRatings(user.userId);
  };

  const logout = () => {
    setCurrentUser(null);
    setRatingsByMovieId({});
  };

  const setMovieRating = ({ movieId, ratingValue }) => {
    setRatingsByMovieId((currentRatingsByMovieId) => ({
      ...currentRatingsByMovieId,
      [movieId]: ratingValue,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        ratingsByMovieId,
        setMovieRating,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
