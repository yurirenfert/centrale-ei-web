import './AddMovie.css';
import AddMovieForm from '../../components/AddMovieForm/AddMovieForm';

function AddMovie() {
  return (
    <div className="AddMovie-container">
      <h1>Ajouter un film</h1>
      <AddMovieForm />
    </div>
  );
}

export default AddMovie;
