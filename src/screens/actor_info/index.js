import React from 'react';
import Screen from "../../common/screen";
import MovieInfoScreen from '../movie_info';
import Movie from '../../models/Movie';
import GridList from '../../common/grid_list';
import MoviePreview from '../../common/movie_preview';
import ScreenStack from '../../common/screen/ScreenStack';

import PropTypes from 'prop-types';
import Actor from '../../models/Actor';

import './styles.scss';
import Backend from '../../Backend';

/**
 * Screen which shows info about a specific actor.
 * @author Johan Svensson
 */
export default class ActorInfoScreen extends Screen {
  static propTypes = {
    data: PropTypes.instanceOf(Actor)
  }

  state = {
    fetchingAssocMovies: false,
    associatedMovies: []
  }

  componentDidMount() {
    this.fetch();
  }

  /**
   * Fetches associated movies for this actor.
   */
  async fetch() {
    let { state, props } = this;
    if (state.fetchingAssocMovies) {
      return;
    }

    this.setState({
      fetchingAssocMovies: true
    });

    let associatedMovies = await Backend.request(
      `/moviesFromActor/${props.id}`
    );
    
    this.setState({
      associatedMovies
    })
  }

  renderContent() {
    let { state, props } = this;

    return (
      <section className="actor-info">
        <div className="info">
          <div role="img" className="profile-picture" style={{
            backgroundImage: `url(${props.data.pictureUri})`
          }}>
          </div>
          <div>
            <h2 className="name">{props.data.name}</h2>
          </div>
        </div>

        <h3>Movies{state.fetchingAssocMovies ? "" : ` (${state.associatedMovies.length})`}</h3>
        <GridList
          data={state.associatedMovies}
          renderItem={movie => (
            <MoviePreview
              title={movie.title}
              pictureSrc={movie.pictureUri}
              onClick={() => {
                ScreenStack.mounted.push(MovieInfoScreen, {
                  movieId: movie.id
                })
              }}
            />
          )}
        />
      </section>
    )
  }
}