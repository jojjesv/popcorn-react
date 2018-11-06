import React from 'react';
import Screen from "../../common/screen";
import MovieInfoScreen from '../movie_info';
import Movie from '../../models/Movie';
import GridList from '../../common/grid_list';
import MoviePreview from '../../common/movie_preview';
import ScreenStack from '../../common/screen/ScreenStack';

import PropTypes from 'prop-types';
import Actor from '../../models/Actor';

import classNames from 'classnames';

import './styles.scss';
import Backend from '../../Backend';
import TaskIndicator from '../../common/task_indicator';
import Utils from '../../Utils';

/**
 * Screen which shows info about a specific actor.
 * @author Johan Svensson
 */
export default class ActorInfoScreen extends Screen {
  static propTypes = {
    data: PropTypes.instanceOf(Actor)
  }

  state = {
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
    let { state, props } = this;
    if (state.fetchingAssocMovies) {
      return;
    }

    let { actor } = props;

    this.setState({
      fetching: true
    });

    let { movies } = await Backend.get(
      `/actor/${actor.id}`
    );

    this.setState({
      associatedMovies: movies,
      fetching: false
    })
  }

  renderContent() {
    let { state, props } = this;

    let data = props.actor;
    let pictureless = !data.pictureUri;

    return (
      <section className="actor-info">
        <div className="info">
          <div role="img"
            className={classNames({
              "profile-picture": true,
              pictureless
            })}
            style={pictureless ? null : {
              backgroundImage: `url(${data.pictureUri})`
            }}>
            {
              pictureless ? (
                <p>{Utils.nameInitials(data.name)}</p>
              ) : null
            }
          </div>
          <div>
            <h2 className="name">{data.name}</h2>
          </div>
        </div>

        <div style={{ position: 'relative', minHeight: 120 }}>
          {
            state.fetching ? (
              <TaskIndicator />
            ) : (
                <>
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
                </>
              )
          }
        </div>
      </section>
    )
  }
}