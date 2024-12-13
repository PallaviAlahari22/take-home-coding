import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

interface Movie {
  title: string;
  release_date: string;
  vote_average: number;
  editors?: string[];
}

export const getMovies = async (year: string, page: number): Promise<Movie[]> => {
  const url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}&primary_release_year=${year}&sort_by=popularity.desc&api_key=${TMDB_API_KEY}`;
  const response = await axios.get(url);
  const movies = response.data.results;

  return Promise.all(
    movies.map(async (m: any) => {
      const editors = await getEditors(m.id);
      return {
        title: m.title,
        release_date: m.release_date,
        vote_average: m.vote_average,
        editors
      };
    })
  );
};

const getEditors = async (movieId: number): Promise<string[]> => {
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`;
    const response = await axios.get(url);
    return response.data.crew
      .filter((member: any) => member.known_for_department === 'Editing')
      .map((editor: any) => editor.name);
  } catch(error) {
    console.log('error while fetching editors : ' + error);
    return [];
  }
};
