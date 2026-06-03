import { useState } from 'react';
import axios from 'axios';
import './AddMovieForm.css';

const DEFAULT_FORM_VALUES = {
  tmdbId: '',
  title: '',
  release_date: '',
  poster_path: '',
  overview: '',
};

function AddMovieForm() {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);
  const [movieCreationError, setMovieCreationError] = useState(null);
  const [movieCreationSuccess, setMovieCreationSuccess] = useState(null);

  const displayCreationSuccessMessage = () => {
    setMovieCreationSuccess('Film ajouté avec succès.');
    setTimeout(() => {
      setMovieCreationSuccess(null);
    }, 3000);
  };

  const updateFormValue = (fieldName, fieldValue) => {
    setFormValues({
      ...formValues,
      [fieldName]: fieldValue,
    });
  };

  const saveMovie = (event) => {
    event.preventDefault();
    setMovieCreationError(null);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/movies/new`, {
        ...formValues,
        tmdbId: Number(formValues.tmdbId),
      })
      .then(() => {
        displayCreationSuccessMessage();
        setFormValues(DEFAULT_FORM_VALUES);
      })
      .catch((error) => {
        setMovieCreationError(
          error.response?.data?.message ||
            'Une erreur est survenue pendant l’ajout du film.'
        );
        console.error(error);
      });
  };

  return (
    <section className="add-movie-section">
      <h2 className="add-movie-title">Ajouter un film</h2>
      <form className="add-movie-form" onSubmit={saveMovie}>
        <input
          className="add-movie-input"
          min="1"
          placeholder="ID TMDB"
          required
          type="number"
          value={formValues.tmdbId}
          onChange={(event) => updateFormValue('tmdbId', event.target.value)}
        />
        <input
          className="add-movie-input"
          placeholder="Titre"
          required
          value={formValues.title}
          onChange={(event) => updateFormValue('title', event.target.value)}
        />
        <input
          className="add-movie-input"
          type="date"
          value={formValues.release_date}
          onChange={(event) =>
            updateFormValue('release_date', event.target.value)
          }
        />
        <input
          className="add-movie-input"
          placeholder="Chemin du poster TMDB"
          value={formValues.poster_path}
          onChange={(event) =>
            updateFormValue('poster_path', event.target.value)
          }
        />
        <textarea
          className="add-movie-textarea"
          placeholder="Résumé"
          value={formValues.overview}
          onChange={(event) => updateFormValue('overview', event.target.value)}
        />
        <button className="add-movie-button" type="submit">
          Ajouter
        </button>
      </form>
      {movieCreationSuccess !== null && (
        <div className="movie-creation-success">{movieCreationSuccess}</div>
      )}
      {movieCreationError !== null && (
        <div className="movie-creation-error">{movieCreationError}</div>
      )}
    </section>
  );
}

export default AddMovieForm;
