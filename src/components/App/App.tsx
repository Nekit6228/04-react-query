import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearchAction = async (formData: FormData) => {
    const query = formData.get('query')?.toString().trim();
    if (!query) {
      toast.error('Please enter your search query.');
      return;
    }

    try {
      setIsLoading(true);
      setError(false);
      setMovies([]);
      const results = await fetchMovies(query);
      if (results.length === 0) {
        toast.error('No movies found for your request.');
      }
      setMovies(results);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleClose = () => setSelectedMovie(null);

  return (
    <>
      <Toaster />
      <SearchBar action={handleSearchAction} />
      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleClose} />}
    </>
  );
}
