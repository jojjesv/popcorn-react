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
    /**
     * @type {Movie}
     */
    let data = {
      id: 1,
      pictureUri: 'https://via.placeholder.com/350x150',
      runtime: 150,
      score: 9.5,
      title: 'Guardians of the galaxy vol. 2',
      cast: [{
        name: 'Bruce Willis',
        pictureUri: 'https://via.placeholder.com/64x64',
      }, {
        name: 'Johnny Depp',
        pictureUri: 'https://via.placeholder.com/64x64',
      }, {
        name: 'Hampus Selin',
        pictureUri: 'https://via.placeholder.com/64x64',
      }]
    }

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
                  <li>Runtime: {Utils.minutesToTimeString(data.runtime)}</li>
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
                            name: actor.name,
                            pictureSrc: actor.pictureUri
                          }, actor.name)
                        }}
                      />
                    )}
                  />
                </div>
              </section>
            </div>
          ) : (
              <div></div>
            )
        }
      </div>
    )
  }
}