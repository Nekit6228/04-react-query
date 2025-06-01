import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from "react-paginate";

import MovieGrid from '../MovieGrig/MovieGrid';
import Loader from '../Loader/Laoder';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import SearchBar from '../SearchBar/SearchBar';
import css from './App.module.css';

import { fetchMovies } from '../../services/movieService';
import type { Movie, FetchMoviesResponse } from '../../types/movie';
import { useQuery } from "@tanstack/react-query";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isError, isLoading, isSuccess } = useQuery<FetchMoviesResponse>({
    queryKey: ['movies', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: !!query,
    retry: false,
    placeholderData: (previousData) => previousData,
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

  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);

  return (
    <>
      <Toaster />
      {isLoading && <Loader />}
      <SearchBar onSubmit={(q) => {
        setQuery(q);
        setCurrentPage(1);
      }} />
      {query && isError && <ErrorMessage />}
      {query && movies.length > 0 ? (
        <>
          <MovieGrid
            movies={movies}
            onSelect={(movie) => {
              setSelectedMovie(movie);
              openModal();
            }}
          />
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setCurrentPage(selected + 1)}
              forcePage={currentPage - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          {isModalOpen && selectedMovie && (
            <MovieModal movie={selectedMovie} onClose={closeModal} />
          )}
        </>
      ) : null}
    </>
  );
}
