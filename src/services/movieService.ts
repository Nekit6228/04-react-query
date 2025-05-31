import axios, { AxiosResponse } from 'axios';
import { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

interface FetchMoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}

export const fetchMovies = async (query: string, page: number): Promise<Movie[]> => {
  const response: AxiosResponse<FetchMoviesResponse> = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });

  return response.data;
};
