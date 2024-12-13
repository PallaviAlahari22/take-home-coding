import { getMovies } from '../movies';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getMovies', () => {
  it('should return movies sorted by popularity for a given year', async () => {
    const mockMoviesResponse = {
      data: {
        results: [
          { id: 1, title: 'Movie 1', release_date: '2020-01-01', vote_average: 8.0 }
        ]
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockMoviesResponse);

    const movies = await getMovies('2020', 1);
    expect(movies).toEqual([
      { title: 'Movie 1', release_date: '2020-01-01', vote_average: 8.0, editors: [] }
    ]);
  });
});
