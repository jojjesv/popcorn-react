import React from 'react';
import Screen from '../../common/screen';
import GridList from '../../common/grid_list';
import MoviePreview from '../../common/movie_preview';
import Movie from '../../models/Movie';
import MovieInfoScreen from '../movie_info';
import ScreenStack from '../../common/screen/ScreenStack';

/**
 * Screen which lists all movies, allows for signing in.
 * @author Johan Svensson
 */
export default class MoviesScreen extends Screen {
  state = {
    movies: [],
    fetchingMovies: false,
  };

  componentDidMount() {
    this.fetch();
  }

  /**
   * Fetches movies.
   */
  async fetch() {
    this.setState({
      fetchingMovies: true,
    });

    setTimeout(() => {
      /**
       * @type {Movie[]}
       */
      let movies = [{
        id: 1,
        title: 'Guardians of the galaxy Vol 2',
        pictureUri: 'https://via.placeholder.com/350x150'
      }, {
        id: 2,
        title: 'Guardians of the galaxy Vol 3',
        pictureUri: 'https://via.placeholder.com/350x150'
      }, {
        id: 3,
        title: 'Guardians of the galaxy Vol 4',
        pictureUri: 'https://via.placeholder.com/350x150'
      }]
      this.setState({
        fetchingMovies: false,
        movies
      })
    }, 1500);
  }

  renderContent() {
    let { state } = this;

    return (
      <div>
        <h1>Hi!</h1>
        <GridList
          data={state.movies}
          renderItem={item => (
            <MoviePreview title={item.title}
              onClick={() => {
                ScreenStack.mounted.push(MovieInfoScreen, {
                  movieId: item.id
                })
              }}
              pictureSrc={item.pictureUri} />
          )}
        />
      </div>
    )
  }
}