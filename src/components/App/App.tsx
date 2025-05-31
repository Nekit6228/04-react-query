import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import SearchBar from '../SearchBar/SearchBar';

import { fetchMovies } from '../../services/movieService';
import { Movie } from '../../types/movie';

import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);


  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== '', 
    keepPreviousData: true,       
  });


  const handleSearch = (newQuery: string) => {
    if (!newQuery.trim()) {
      toast.error('Please enter your search query.');
      return;
    }
    setQuery(newQuery);
    setPage(1); 
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data && data.results.length === 0 && (
        <p style={{ textAlign: 'center' }}>No movies found for your request.</p>
      )}

      {data && data.results.length > 0 && (
        <>
          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />

          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
