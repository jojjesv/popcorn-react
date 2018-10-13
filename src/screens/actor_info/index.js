import React from 'react';
import Screen from "../../common/screen";
import MovieInfoScreen from '../movie_info';
import Movie from '../../models/Movie';
import GridList from '../../common/grid_list';
import MoviePreview from '../../common/movie_preview';

/**
 * Screen which shows info about a specific actor.
 * @author Johan Svensson
 */
export default class ActorInfoScreen extends Screen {
  state = {
    movieInfoVisible: false,
    movieInfoMovieId: null,
    fetching: false,
    associatedMovies: []
  }

  componentDidMount() {
    this.fetch();
  }

  /**
   * Fetches associated movies for this actor.
   */
  async fetch() {
    /**
     * @type {Movie[]}
     */
    let associatedMovies = [
      {
        title: 'Guardians of the galaxy vol 2',
        pictureUri: 'https://via.placeholder.com/350x150'
      }
    ]
    this.setState({
      associatedMovies
    })
  }

  renderContent() {
    let { state } = this;

    return (
      <section className="actor-info">
        <div role="img" className="profile-picture"></div>

        <GridList
          data={state.associatedMovies}
          renderItem={movie => (
            <MoviePreview
              data={movie}
              onClick={() => this.setState({
                movieInfoVisible: true,
                movieInfoMovieId: movie.id
              })}
            />
          )}
        />
      </section>
    )
  }

  render() {
    let { state } = this;

    let MovieInfoScreenComponent = state.movieInfoVisible ? MovieInfoScreen : null;
    return (
      <div>
        {
          super.render()
        }
        {
          MovieInfoScreenComponent &&
          <MovieInfoScreenComponent
            visible={state.movieInfoVisible}
            movieId={state.movieInfoMovieId}
          />
        }
      </div>
    )
  }
}