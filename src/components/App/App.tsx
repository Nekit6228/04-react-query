import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from "react-paginate";

import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import SearchBar from '../SearchBar/SearchBar';
import css from './App.module.css';

import { fetchMovies } from '../../services/movieServise';
import { Movie } from '../../types/movie';
import { useQuery } from "@tanstack/react-query";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['movies', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: !!query,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (data?.page) setCurrentPage(data.page);
  }, [data?.page]);

  useEffect(() => {
    if (isSuccess && movies.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isSuccess, movies]);

  const handleSearchSubmit = (searchQuery: string): void => {
    setQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleMovieSelect = (movie: Movie): void => {
    setSelectedMovie(movie);
  };

  const closeModal = (): void => {
    setSelectedMovie(null);
  };

  return (
    <>
      <Toaster />
      {isLoading && <Loader />}
      <SearchBar onSubmit={handleSearchSubmit} />
      {query && isError && <ErrorMessage />}
      {query && movies.length > 0 ? (
        <>
          <MovieGrid movies={movies} onSelect={handleMovieSelect} />
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }: { selected: number }) =>
                setCurrentPage(selected + 1)
              }
              forcePage={currentPage - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          {selectedMovie && (
            <MovieModal movie={selectedMovie} onClose={closeModal} />
          )}
        </>
      ) : null}
    </>
  );
}
