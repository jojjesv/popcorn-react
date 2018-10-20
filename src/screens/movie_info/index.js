import React from 'react';
import PropTypes from 'prop-types';
import Movie from '../../models/Movie';
import Screen from '../../common/screen';

import './styles.scss';
import Utils from '../../Utils';
import GridList from '../../common/grid_list';
import ActorPreview from '../../common/actor_preview';
import ActorInfoScreen from '../actor_info';
import ScreenStack from '../../common/screen/ScreenStack';
import Backend from '../../Backend';
import TaskIndicator from '../../common/task_indicator';

/**
 * Screen which shows info about a specific movie.
 * Fetches actors and additional info.
 * @author Johan Svensson
 */
export default class MovieInfoScreen extends Screen {
  static propTypes = {
    movieId: PropTypes.any,
  }

  state = {
    /**
     * @type {Movie}
     */
    data: null,
    fetchingData: false,
    actorInfoVisible: false,
    actorInfoData: null
  };

  componentDidMount() {
    this.fetch();
  }

  /**
   * Fetches movie info.
   */
  async fetch() {
    let { state, props } = this;
    if (state.fetchingData) {
      return;
    }

    this.setState({
      fetchingData: true
    });

    let data = await Backend.request(
      `/movie/${props.movieId}`
    );

    this.setState({
      data,
      fetchingData: false
    })
  }

  renderContent() {
    let { state } = this;
    let { data } = state;

    return (
      <div className="movie-info">
        {
          data ? (
            <div>
              <header className="hero" style={{
                backgroundImage: `url(${data.pictureUri})`
              }}>
                <h2 className="title">{data.title}</h2>
              </header>
              <section className="info">
                <ul className="specs">
                  <li>Runtime: {Utils.minutesToTimeString(data.runtime)}</li>
                  <li>Score: {data.score}</li>
                </ul>

                <h3>Cast ({data.cast.length})</h3>
                <div>
                  <GridList
                    data={data.cast}
                    renderItem={actor => (
                      <ActorPreview
                        name={actor.name}
                        pictureSrc={actor.pictureUri}
                        onClick={() => {
                          ScreenStack.mounted.push(ActorInfoScreen, {
                            data: actor
                          }, actor.name)
                        }}
                      />
                    )}
                  />
                </div>
              </section>
            </div>
          ) : (
              <div>
                <TaskIndicator />
              </div>
            )
        }
      </div>
    )
  }
}