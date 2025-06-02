import css from "./App.module.css";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: !!query,
    retry: false,
    keepPreviousData: true,
  });

  const movies = data?.results;
  const totalPages = data?.total_pages ?? 0;


  useEffect(() => {
    setCurrentPage(1);
  }, [query]);


  useEffect(() => {
    if (isSuccess && movies?.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isSuccess, movies]);

  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);

  return (
    <>
      <Toaster />

      <SearchBar onSubmit={(newQuery) => setQuery(newQuery)} />

      {query && isError && <ErrorMessage />}
      {isLoading && <Loader />}

      {query && movies && movies.length > 0 ? (
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
        </>
      ) : null}

      {isModalOpen && selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => {
            closeModal();
            setSelectedMovie(null);
          }}
        />
      )}
    </>
  );
}