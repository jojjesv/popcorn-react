import React from 'react';
import Screen from '../../common/screen';
import GridList from '../../common/grid_list';
import MoviePreview from '../../common/movie_preview';
import Movie from '../../models/Movie';
import './styles.scss';
import MovieInfoScreen from '../movie_info';
import ScreenStack from '../../common/screen/ScreenStack';
import AddMovieScreen from '../add_movie';
import Backend from '../../Backend';
import TaskIndicator from '../../common/task_indicator';

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

    let movies = await Backend.request(
      '/movies'
    );

    this.setState({
      movies,
      fetchingMovies: false
    })
  }

  renderHeaderExtraContent() {
    return (
      <button className="extra-btn add-movie" onClick={() => this.toAddMovie()}>
        <img src={require('../../assets/ic_add.png')} alt="Add" />
      </button>
    )
  }

  /**
   * Navigates to the "add movie" screen.
   */
  toAddMovie() {
    ScreenStack.mounted.push(AddMovieScreen, {}, "Add movie");
  }

  renderContent() {
    let { state } = this;

    return (
      <div>
        <h1>Hi!</h1>
        {
          state.fetchingMovies && (
            <TaskIndicator />
          )
        }
        {
          !state.fetchingMovies && !state.movies.length ? (
            //  No items!
            <div className="no-items">
              <h2 className="center thin title">The collection is empty</h2>
              <p className="center thin subtitle">Click the <span>
                <img className="add-icon" alt="Plus" src={require('../../assets/ic_add.png')} />
              </span> to add a movie</p>
            </div>
          ) : (
              <GridList
                data={state.movies}
                renderItem={item => (
                  <MoviePreview title={item.title}
                    onClick={() => {
                      ScreenStack.mounted.push(MovieInfoScreen, {
                        movieId: item.id
                      }, item.title);
                    }}
                    pictureSrc={item.pictureUri} />
                )}
              />
            )
        }
      </div>
    )
  }
}